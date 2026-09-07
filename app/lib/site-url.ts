import "server-only";

/**
 * Canonical public origin for metadata, robots, and sitemap.
 * Prefer MOTIF_APP_URL; fall back to Vercel production host, then preview, then local.
 */
export function getSiteUrl(): URL {
  const configured = process.env.MOTIF_APP_URL?.trim();
  if (configured) {
    return new URL(configured.endsWith("/") ? configured.slice(0, -1) : configured);
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) {
    return new URL(
      productionHost.startsWith("http")
        ? productionHost
        : `https://${productionHost}`,
    );
  }

  const previewHost = process.env.VERCEL_URL?.trim();
  if (previewHost) {
    return new URL(
      previewHost.startsWith("http") ? previewHost : `https://${previewHost}`,
    );
  }

  return new URL("http://localhost:3000");
}

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, getSiteUrl()).toString();
}
