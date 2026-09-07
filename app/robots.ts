import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteUrl } from "./lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const host = getSiteUrl().origin;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/my-vibe",
        "/shortlist",
        "/verify-email",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host,
  };
}
