import { neon } from "@neondatabase/serverless";

export function getDatabase() {
  const connectionString = process.env.NEON_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("NEON_CONNECTION_STRING is not configured.");
  }

  return neon(connectionString);
}
