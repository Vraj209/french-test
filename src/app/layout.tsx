import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/app/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "French Test AI",
  description: "AI-powered TEF Canada and TCF Canada French exam practice from CEFR A1 to B2."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
