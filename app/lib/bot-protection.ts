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
 */
export async function assertHumanRequest() {
  const verification = await checkBotId();

  if (verification.isBot) {
    throw new BotProtectionError();
  }
}
