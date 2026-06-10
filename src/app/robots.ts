import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/login",
        "/metrics",
        "/register",
        "/results/",
        "/tests/"
      ]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
