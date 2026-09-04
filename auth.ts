import { Pool } from "@neondatabase/serverless";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { claimAnonymousTasteProfile } from "./app/lib/taste-profile";
import { authenticatePasswordUser } from "./app/lib/auth-users";
import { markEmailVerified } from "./app/lib/email-verification";

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const connectionString = process.env.NEON_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("NEON_CONNECTION_STRING is not configured.");
  }

  const pool = new Pool({ connectionString });

  return {
    adapter: PostgresAdapter(pool),
    session: { strategy: "jwt" },
    providers: [
      Google({ allowDangerousEmailAccountLinking: true }),
      Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          return authenticatePasswordUser(credentials);
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
          const emailVerified =
            typeof profile === "object" &&
            profile !== null &&
            (profile as { email_verified?: unknown }).email_verified === true;

          if (!emailVerified) {
            return false;
          }

          if (user.id) {
            await markEmailVerified(user.id);
          }
        }

        if (user.id) {
          try {
            await claimAnonymousTasteProfile(user.id);
          } catch (error) {
            console.error("Anonymous taste profile claim failed:", error);
          }
        }

        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
        }

        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id ?? token.sub ?? "";
          session.user.name = token.name ?? null;
          session.user.email = token.email ?? "";
          session.user.image = token.picture ?? null;
        }

        return session;
      },
    },
  };
});
