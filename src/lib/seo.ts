import type { Metadata } from "next";

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[];

export type JsonLdObject = {
  [key: string]: JsonLdValue;
};

export const siteName = "Francivo";
export const siteDescription =
  "AI-powered TEF Canada, TCF Canada, NCLC 7, French grammar, and French learning practice from CEFR A1 to B2.";

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    return new URL(rawUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type: "website"
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}

export function buildOrganizationJsonLd(): JsonLdObject {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.svg"),
    description: siteDescription
  };
}

export function buildWebSiteJsonLd(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteName,
    url: absoluteUrl("/"),
    description: siteDescription,
    publisher: {
      "@id": absoluteUrl("/#organization")
    }
  };
}

export function buildSiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationJsonLd(), buildWebSiteJsonLd()]
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildItemListJsonLd(
  items: Array<{ name: string; description?: string | null; path: string }>
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LearningResource",
        name: item.name,
        description: item.description || "",
        url: absoluteUrl(item.path),
        provider: {
          "@id": absoluteUrl("/#organization")
        }
      }
    }))
  };
}

export function buildLearningResourceJsonLd({
  name,
  description,
  path,
  educationalLevel,
  about,
  learningResourceType = "Guide"
}: {
  name: string;
  description: string;
  path: string;
  educationalLevel?: string;
  about?: string[];
  learningResourceType?: string;
}): JsonLdObject {
  const resource: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    url: absoluteUrl(path),
    learningResourceType,
    provider: {
      "@id": absoluteUrl("/#organization")
    }
  };

  if (educationalLevel) {
    resource.educationalLevel = educationalLevel;
  }

  if (about && about.length > 0) {
    resource.about = about;
  }

  return resource;
}
