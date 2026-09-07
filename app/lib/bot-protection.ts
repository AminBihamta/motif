import "server-only";

import { checkBotId } from "botid/server";

export class BotProtectionError extends Error {
  constructor(message = "Automated traffic was blocked. Please try again in a browser.") {
    super(message);
    this.name = "BotProtectionError";
  }
}

/**
 * Rejects verified bots on protected Server Actions / handlers.
 * Local development returns isBot: false unless developmentOptions are set.
 *
 * If BotID infrastructure is misconfigured (e.g. missing Vercel OIDC), we log
 * and allow the request so product flows are not taken offline.
 */
export async function assertHumanRequest() {
  try {
    const verification = await checkBotId();

    if (verification.isBot) {
      throw new BotProtectionError();
    }
  } catch (error) {
    if (error instanceof BotProtectionError) {
      throw error;
    }

    console.error("BotID check failed; allowing request:", error);
  }
}
