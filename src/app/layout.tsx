import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/app/providers";
import { JsonLd } from "@/components/seo/json-ld";
import { buildSiteJsonLd, getSiteUrl, siteDescription, siteName } from "@/lib/seo";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/",
    siteName,
    type: "website"
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <JsonLd id="site-structured-data" data={buildSiteJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
