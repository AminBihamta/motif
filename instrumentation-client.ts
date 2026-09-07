// PostHog is initialized only after explicit analytics consent.
// See app/lib/analytics-consent.ts and app/components/cookie-consent.tsx.
import { initBotId } from "botid/client/core";

// Protect pages that invoke expensive / abuse-prone Server Actions.
// The path is the page URL that posts the action, not the action file path.
initBotId({
  protect: [
    { path: "/find-my-vibe", method: "POST" },
    { path: "/my-vibe", method: "POST" },
    { path: "/contact", method: "POST" },
    { path: "/signin", method: "POST" },
  ],
});
