import "server-only";
import { unstable_cache } from "next/cache";

export type ProductSearchResult = {
  id: string;
  title: string;
  price: string | null;
  extractedPrice: number | null;
  source: string;
  link: string;
  thumbnail: string | null;
  rating: number | null;
  reviews: number | null;
  availability: string | null;
  isPrime: boolean;
  isSponsored: boolean;
};

type TasteSearchProfile = {
  vibeName: string;
  characteristics: string[];
  colors: string[];
};

type AmazonSearchOrganicResult = {
  asin?: unknown;
  position?: unknown;
  title?: unknown;
  link?: unknown;
  brand?: unknown;
  price?: unknown;
  extracted_price?: unknown;
  thumbnail?: unknown;
  rating?: unknown;
  reviews?: unknown;
  availability?: unknown;
  is_prime?: unknown;
  is_sponsored?: unknown;
};

type AmazonSearchResponse = {
  organic_results?: unknown;
  error?: unknown;
};

const amazonDomains = new Set([
  "amazon.ae",
  "amazon.ca",
  "amazon.co.jp",
  "amazon.co.uk",
  "amazon.com",
  "amazon.com.au",
  "amazon.com.be",
  "amazon.com.br",
  "amazon.com.tr",
  "amazon.com.mx",
  "amazon.de",
  "amazon.es",
  "amazon.eg",
  "amazon.fr",
  "amazon.in",
  "amazon.ie",
  "amazon.it",
  "amazon.nl",
  "amazon.pl",
  "amazon.sa",
  "amazon.se",
  "amazon.sg",
  "amazon.co.za",
]);

const sortOptions = new Set([
  "featured",
  "price_low_to_high",
  "price_high_to_low",
  "average_review",
  "newest_arrivals",
  "bestsellers",
]);

const languageOptions = new Set([
  "ar_SA",
  "ar_EG",
  "ar_AE",
  "zh_CN",
  "nl_NL",
  "nl_BE",
  "en_AE",
  "en_GB",
  "fr_FR",
  "fr_BE",
  "de_DE",
  "it_IT",
  "ja_JP",
  "pl_PL",
  "pt_BR",
  "es_ES",
  "es_MX",
  "es_US",
  "se_SE",
  "tr_TR",
]);

const deliveryCountries = new Set([
  "dz",
  "ao",
  "bh",
  "bw",
  "cm",
  "eg",
  "gh",
  "il",
  "jo",
  "ke",
  "kw",
  "kg",
  "mu",
  "yt",
  "ma",
  "na",
  "ng",
  "om",
  "ps",
  "qa",
  "re",
  "sa",
  "sn",
  "za",
  "tz",
  "tn",
  "ug",
  "ae",
  "zw",
  "ar",
  "aw",
  "bb",
  "bz",
  "bm",
  "bo",
  "br",
  "ca",
  "ky",
  "cl",
  "co",
  "cr",
  "do",
  "ec",
  "sv",
  "gf",
  "gp",
  "gt",
  "hn",
  "jm",
  "mq",
  "mx",
  "pa",
  "py",
  "pe",
  "kn",
  "mf",
  "tt",
  "uy",
  "ve",
  "au",
  "bd",
  "kh",
  "cn",
  "fj",
  "hk",
  "in",
  "id",
  "jp",
  "kz",
  "mo",
  "my",
  "mh",
  "fm",
  "nc",
  "nz",
  "pk",
  "pw",
  "ph",
  "sg",
  "kr",
  "lk",
  "tw",
  "th",
  "vn",
  "al",
  "ad",
  "am",
  "at",
  "by",
  "be",
  "ba",
  "bg",
  "hr",
  "cy",
  "cz",
  "dk",
  "ee",
  "fo",
  "fi",
  "fr",
  "ge",
  "de",
  "gi",
  "gr",
  "hu",
  "is",
  "ie",
  "it",
  "lv",
  "li",
  "lt",
  "lu",
  "mt",
  "md",
  "mc",
  "me",
  "nl",
  "mk",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sm",
  "rs",
  "sk",
  "si",
  "es",
  "se",
  "ch",
  "tr",
  "ua",
  "gb",
  "us",
  "va",
]);

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function normalizeResult(
  result: AmazonSearchOrganicResult,
  index: number,
): ProductSearchResult | null {
  const link = isHttpUrl(result.link) ? result.link : null;

  if (typeof result.title !== "string" || !link) {
    return null;
  }

  return {
    id:
      typeof result.asin === "string"
        ? result.asin
        : `${index}-${result.title}-${link}`,
    title: result.title,
    price: typeof result.price === "string" ? result.price : null,
    extractedPrice:
      typeof result.extracted_price === "number"
        ? result.extracted_price
        : null,
    source: typeof result.brand === "string" ? result.brand : "Amazon",
    link,
    thumbnail: isHttpUrl(result.thumbnail) ? result.thumbnail : null,
    rating: typeof result.rating === "number" ? result.rating : null,
    reviews: typeof result.reviews === "number" ? result.reviews : null,
    availability:
      typeof result.availability === "string" ? result.availability : null,
    isPrime: result.is_prime === true,
    isSponsored: result.is_sponsored === true,
  };
}

function appendOptionalParameter(
  parameters: URLSearchParams,
  name: string,
  value: string | undefined,
  options?: {
    maxLength?: number;
    allowedValues?: Set<string>;
  },
) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return;
  }

  if (options?.maxLength && trimmedValue.length > options.maxLength) {
    return;
  }

  if (options?.allowedValues && !options.allowedValues.has(trimmedValue)) {
    return;
  }

  parameters.set(name, trimmedValue);
}

export function buildTasteShapedQuery(
  query: string,
  tasteProfile: TasteSearchProfile,
) {
  const tasteTerms = [
    tasteProfile.vibeName,
    ...tasteProfile.characteristics.slice(0, 3),
    ...tasteProfile.colors.slice(0, 2),
  ]
    .join(" ")
    .replace(/[^\p{L}\p{N}\s,'&-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${query.trim()} ${tasteTerms}`.trim();
}

function getSearchCacheKey(searchQuery: string) {
  return [
    searchQuery,
    process.env.SEARCHAPI_AMAZON_DOMAIN ?? "amazon.com",
    process.env.SEARCHAPI_AMAZON_SORT_BY ?? "featured",
    process.env.SEARCHAPI_LANGUAGE ?? "",
    process.env.SEARCHAPI_DELIVERY_COUNTRY ?? "",
    process.env.SEARCHAPI_POSTAL_CODE ?? "",
    process.env.SEARCHAPI_DELIVERY_CITY ?? "",
    process.env.SEARCHAPI_DELIVERY_AREA ?? "",
  ].join("|");
}

export async function searchTasteShapedProducts(
  query: string,
  tasteProfile: TasteSearchProfile,
) {
  const searchQuery = buildTasteShapedQuery(query, tasteProfile);
  const cachedSearch = unstable_cache(
    () => searchAmazonProducts(searchQuery),
    ["motif-product-search", getSearchCacheKey(searchQuery)],
    { revalidate: 300 },
  );

  return cachedSearch();
}

export async function searchAmazonProducts(searchQuery: string) {
  const apiKey = process.env.SEARCHAPI_API_KEY;

  if (!apiKey) {
    throw new Error("SEARCHAPI_API_KEY is not configured.");
  }

  const configuredAmazonDomain = process.env.SEARCHAPI_AMAZON_DOMAIN;
  const configuredSortBy = process.env.SEARCHAPI_AMAZON_SORT_BY;
  const amazonDomain =
    configuredAmazonDomain && amazonDomains.has(configuredAmazonDomain)
      ? configuredAmazonDomain
      : "amazon.com";
  const sortBy =
    configuredSortBy && sortOptions.has(configuredSortBy)
      ? configuredSortBy
      : "featured";

  const parameters = new URLSearchParams({
    engine: "amazon_search",
    q: searchQuery,
    amazon_domain: amazonDomain,
    sort_by: sortBy,
    page: "1",
  });

  appendOptionalParameter(parameters, "language", process.env.SEARCHAPI_LANGUAGE, {
    allowedValues: languageOptions,
  });
  appendOptionalParameter(
    parameters,
    "delivery_country",
    process.env.SEARCHAPI_DELIVERY_COUNTRY,
    { allowedValues: deliveryCountries },
  );
  const postalCode = process.env.SEARCHAPI_POSTAL_CODE?.trim();
  const deliveryCity = process.env.SEARCHAPI_DELIVERY_CITY?.trim();

  appendOptionalParameter(
    parameters,
    "postal_code",
    postalCode,
    { maxLength: 20 },
  );

  if (!postalCode) {
    appendOptionalParameter(parameters, "delivery_city", deliveryCity, {
      maxLength: 100,
    });

    if (deliveryCity) {
      appendOptionalParameter(
        parameters,
        "delivery_area",
        process.env.SEARCHAPI_DELIVERY_AREA,
        { maxLength: 100 },
      );
    }
  }

  const response = await fetch(
    `https://www.searchapi.io/api/v1/search?${parameters}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(90_000),
    },
  );

  if (!response.ok) {
    throw new Error(`SearchApi returned ${response.status}.`);
  }

  const payload = (await response.json()) as AmazonSearchResponse;

  if (typeof payload.error === "string") {
    throw new Error(payload.error);
  }

  if (!Array.isArray(payload.organic_results)) {
    return [];
  }

  return payload.organic_results
    .map((result, index) =>
      normalizeResult(result as AmazonSearchOrganicResult, index),
    )
    .filter((result): result is ProductSearchResult => result !== null)
    .slice(0, 12);
}
