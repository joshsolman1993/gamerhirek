import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { NewsTicker } from "@/components/NewsTicker";

export const metadata: Metadata = {
  title: {
    default: "GamerHírek — Magyar Gaming & Esport Hírek",
    template: "%s | GamerHírek",
  },
  description:
    "Magyar nyelvű gaming hírek versenyjátékosoknak. Valorant patch notes, esport eredmények, tippek és útmutatók.",
  keywords: ["valorant", "gaming", "esport", "patch notes", "magyar", "hírek"],
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName: "GamerHírek",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
            <Navbar />
            <NewsTicker />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
