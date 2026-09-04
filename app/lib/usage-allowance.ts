import "server-only";

import { createHmac, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { getDatabase } from "./db";

export type UsageKind = "analysis" | "search";

type AllowanceRow = {
  id: string;
  analyses_remaining: number;
  searches_remaining: number;
  period_starts_at: string | Date;
};

export type UsageSummary = {
  analysesRemaining: number;
  searchesRemaining: number;
  eligible: boolean;
  isGuest: boolean;
};

export class UsageAllowanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsageAllowanceError";
  }
}

export type UsageReservation = {
  id: string;
  allowanceId: string;
  kind: UsageKind;
};

const guestAnalysisAllowance = 1;
const guestSearchAllowance = 1;
const memberAnalysisAllowance = 5;
const memberSearchAllowance = 5;
const guestNetworkLimit = 5;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeIpPrefix(value: string | null) {
  const ip = value?.split(",")[0]?.trim() ?? "unknown";

  if (ip.includes(":")) {
    return ip.split(":").slice(0, 4).join(":");
  }

  const parts = ip.split(".");
  return parts.length === 4 ? `${parts.slice(0, 3).join(".")}.0` : "unknown";
}

function userAgentFamily(value: string | null) {
  return (value ?? "unknown").slice(0, 80).toLowerCase();
}

async function guestNetworkHash() {
  const secret = process.env.MOTIF_ABUSE_HMAC_SECRET;
  if (!secret) {
    throw new UsageAllowanceError("Guest usage is not configured yet.");
  }

  const requestHeaders = await headers();
  const issuedOn = new Date().toISOString().slice(0, 10);
  const fingerprint = [
    issuedOn,
    normalizeIpPrefix(requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip")),
    userAgentFamily(requestHeaders.get("user-agent")),
  ].join("|");

  return createHmac("sha256", secret).update(fingerprint).digest("hex");
}

async function refreshMemberAllowanceIfNeeded(row: AllowanceRow): Promise<AllowanceRow> {
  const periodStart = new Date(row.period_starts_at).getTime();
  if (Number.isNaN(periodStart) || Date.now() < periodStart + WEEK_MS) {
    return row;
  }

  const sql = getDatabase();
  const periodStartsAt = new Date();
  const updated = await sql`
    UPDATE public.motif_usage_allowances
    SET
      analyses_remaining = ${memberAnalysisAllowance},
      searches_remaining = ${memberSearchAllowance},
      period_starts_at = ${periodStartsAt},
      updated_at = now()
    WHERE id = ${row.id}::uuid
      AND period_starts_at = ${row.period_starts_at}::timestamptz
    RETURNING id, analyses_remaining, searches_remaining, period_starts_at
  ` as AllowanceRow[];

  if (updated[0]) {
    return updated[0];
  }

  const current = await sql`
    SELECT id, analyses_remaining, searches_remaining, period_starts_at
    FROM public.motif_usage_allowances
    WHERE id = ${row.id}::uuid
    LIMIT 1
  ` as AllowanceRow[];

  return current[0] ?? row;
}

async function getVerifiedAccountAllowance(userId: string) {
  const sql = getDatabase();
  const users = await sql`
    SELECT "emailVerified"
    FROM public.users
    WHERE id::text = ${userId}
    LIMIT 1
  ` as Array<{ emailVerified: unknown }>;

  if (!users[0]?.emailVerified) {
    throw new UsageAllowanceError(
      "Verify your email to unlock five analyses and five searches per week.",
    );
  }

  await sql`
    INSERT INTO public.motif_usage_allowances (
      user_id, analyses_remaining, searches_remaining, period_starts_at
    ) VALUES (
      ${userId},
      ${memberAnalysisAllowance},
      ${memberSearchAllowance},
      now()
    )
    ON CONFLICT (user_id) DO NOTHING
  `;

  const rows = await sql`
    SELECT id, analyses_remaining, searches_remaining, period_starts_at
    FROM public.motif_usage_allowances
    WHERE user_id = ${userId}
    LIMIT 1
  ` as AllowanceRow[];
  const allowance = rows[0];
  if (!allowance) return null;

  await releaseExpiredReservations(allowance.id);

  const currentRows = await sql`
    SELECT id, analyses_remaining, searches_remaining, period_starts_at
    FROM public.motif_usage_allowances
    WHERE id = ${allowance.id}::uuid
    LIMIT 1
  ` as AllowanceRow[];

  return refreshMemberAllowanceIfNeeded(currentRows[0] ?? allowance);
}

async function getGuestAllowance(anonymousOwnerId: string) {
  const sql = getDatabase();
  const existing = await sql`
    SELECT id, analyses_remaining, searches_remaining, period_starts_at
    FROM public.motif_usage_allowances
    WHERE anonymous_id = ${anonymousOwnerId}::uuid
    LIMIT 1
  ` as AllowanceRow[];

  if (existing[0]) return existing[0];

  const networkHash = await guestNetworkHash();
  const issuedOn = new Date().toISOString().slice(0, 10);
  const expiresAt = new Date(Date.now() + WEEK_MS);
  const windowRows = await sql`
    INSERT INTO public.motif_guest_network_windows (
      network_hash, issued_on, guest_issuance_count, expires_at
    ) VALUES (${networkHash}, ${issuedOn}::date, 1, ${expiresAt})
    ON CONFLICT (network_hash, issued_on) DO UPDATE
      SET guest_issuance_count = public.motif_guest_network_windows.guest_issuance_count + 1,
          expires_at = EXCLUDED.expires_at
      WHERE public.motif_guest_network_windows.guest_issuance_count < ${guestNetworkLimit}
    RETURNING guest_issuance_count
  `;

  if (windowRows.length === 0) {
    throw new UsageAllowanceError("Guest access is temporarily limited on this network. Sign in to continue.");
  }

  await sql`
    INSERT INTO public.motif_usage_allowances (
      anonymous_id, analyses_remaining, searches_remaining, period_starts_at
    ) VALUES (
      ${anonymousOwnerId}::uuid,
      ${guestAnalysisAllowance},
      ${guestSearchAllowance},
      now()
    )
    ON CONFLICT (anonymous_id) DO NOTHING
  `;

  const rows = await sql`
    SELECT id, analyses_remaining, searches_remaining, period_starts_at
    FROM public.motif_usage_allowances
    WHERE anonymous_id = ${anonymousOwnerId}::uuid
    LIMIT 1
  ` as AllowanceRow[];
  return rows[0] ?? null;
}

async function getAllowance(userId?: string, anonymousOwnerId?: string) {
  if (userId) return getVerifiedAccountAllowance(userId);
  if (anonymousOwnerId) return getGuestAllowance(anonymousOwnerId);
  throw new UsageAllowanceError("A Motif owner is required.");
}

async function releaseExpiredReservations(allowanceId: string) {
  const sql = getDatabase();
  await sql`
    WITH expired AS (
      UPDATE public.motif_usage_reservations
      SET status = 'released', settled_at = now()
      WHERE allowance_id = ${allowanceId}::uuid
        AND status = 'reserved'
        AND expires_at <= now()
      RETURNING usage_kind
    ), totals AS (
      SELECT
        count(*) FILTER (WHERE usage_kind = 'analysis')::smallint AS analyses,
        count(*) FILTER (WHERE usage_kind = 'search')::smallint AS searches
      FROM expired
    )
    UPDATE public.motif_usage_allowances AS allowance
    SET
      analyses_remaining = allowance.analyses_remaining + totals.analyses,
      searches_remaining = allowance.searches_remaining + totals.searches,
      updated_at = now()
    FROM totals
    WHERE allowance.id = ${allowanceId}::uuid
      AND (totals.analyses > 0 OR totals.searches > 0)
  `;
}

export async function reserveUsage(
  kind: UsageKind,
  owner: { userId?: string; anonymousOwnerId?: string },
): Promise<UsageReservation> {
  const allowance = await getAllowance(owner.userId, owner.anonymousOwnerId);
  if (!allowance) throw new UsageAllowanceError("Your Motif allowance could not be loaded.");
  await releaseExpiredReservations(allowance.id);

  const remainingColumn = kind === "analysis" ? "analyses_remaining" : "searches_remaining";
  const sql = getDatabase();
  const reservationId = randomUUID();
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000);
  const rows = await sql.query(
    `WITH debited AS (
      UPDATE public.motif_usage_allowances
      SET ${remainingColumn} = ${remainingColumn} - 1, updated_at = now()
      WHERE id = $1::uuid AND ${remainingColumn} > 0
      RETURNING id
    )
    INSERT INTO public.motif_usage_reservations (
      id, allowance_id, usage_kind, status, expires_at
    )
    SELECT $2::uuid, id, $3, 'reserved', $4::timestamptz
    FROM debited
    RETURNING allowance_id`,
    [allowance.id, reservationId, kind, expiresAt.toISOString()],
  ) as Array<{ allowance_id: string }>;

  if (!rows[0]) {
    if (owner.userId) {
      throw new UsageAllowanceError(
        kind === "analysis"
          ? "You have used this week’s analyses. Your allowance refreshes in up to seven days."
          : "You have used this week’s searches. Your allowance refreshes in up to seven days.",
      );
    }

    throw new UsageAllowanceError(
      kind === "analysis"
        ? "You have used your free analyses. Sign in or verify your account to continue."
        : "You have used your free searches. Sign in or verify your account to continue.",
    );
  }

  return { id: reservationId, allowanceId: allowance.id, kind };
}

export async function commitUsage(reservation: UsageReservation) {
  const sql = getDatabase();
  await sql`
    UPDATE public.motif_usage_reservations
    SET status = 'committed', settled_at = now()
    WHERE id = ${reservation.id}::uuid
      AND allowance_id = ${reservation.allowanceId}::uuid
      AND status = 'reserved'
  `;
}

export async function releaseUsage(reservation: UsageReservation) {
  const sql = getDatabase();
  const remainingColumn = reservation.kind === "analysis"
    ? "analyses_remaining"
    : "searches_remaining";
  await sql.query(
    `WITH released AS (
      UPDATE public.motif_usage_reservations
      SET status = 'released', settled_at = now()
      WHERE id = $1::uuid
        AND allowance_id = $2::uuid
        AND usage_kind = $3
        AND status = 'reserved'
      RETURNING allowance_id
    )
    UPDATE public.motif_usage_allowances AS allowance
    SET ${remainingColumn} = allowance.${remainingColumn} + 1,
        updated_at = now()
    FROM released
    WHERE allowance.id = released.allowance_id`,
    [reservation.id, reservation.allowanceId, reservation.kind],
  );
}

export async function getUsageSummary(
  owner: { userId?: string; anonymousOwnerId?: string },
): Promise<UsageSummary | null> {
  try {
    if (owner.userId) {
      const allowance = await getVerifiedAccountAllowance(owner.userId);
      return allowance ? {
        analysesRemaining: allowance.analyses_remaining,
        searchesRemaining: allowance.searches_remaining,
        eligible: true,
        isGuest: false,
      } : null;
    }

    if (!owner.anonymousOwnerId) {
      return {
        analysesRemaining: guestAnalysisAllowance,
        searchesRemaining: guestSearchAllowance,
        eligible: true,
        isGuest: true,
      };
    }

    const sql = getDatabase();
    const rows = await sql`
      SELECT analyses_remaining, searches_remaining
      FROM public.motif_usage_allowances
      WHERE anonymous_id = ${owner.anonymousOwnerId}::uuid
      LIMIT 1
    ` as Array<Pick<AllowanceRow, "analyses_remaining" | "searches_remaining">>;
    const allowance = rows[0];
    return {
      analysesRemaining: allowance?.analyses_remaining ?? guestAnalysisAllowance,
      searchesRemaining: allowance?.searches_remaining ?? guestSearchAllowance,
      eligible: true,
      isGuest: true,
    };
  } catch (error) {
    if (error instanceof UsageAllowanceError) {
      return { analysesRemaining: 0, searchesRemaining: 0, eligible: false, isGuest: false };
    }
    console.error("Could not load Motif usage summary:", error);
    return null;
  }
}
