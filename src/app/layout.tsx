import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { RouteTracker } from "@/components/tracking/RouteTracker";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Domaine des Élégances — Lieu de prestige pour mariages et réceptions",
    template: "%s · Domaine des Élégances",
  },
  description:
    "Domaine des Élégances : un lieu d'exception pour célébrer mariages, enterrements de vie de jeune fille ou de garçon et événements festifs.",
  keywords: [
    "domaine mariage",
    "lieu de réception prestige",
    "EVJF",
    "EVG",
    "anniversaire chic",
    "domaine des élégances",
  ],
  authors: [{ name: "Domaine des Élégances" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Domaine des Élégances",
    locale: "fr_FR",
    images: [
      {
        url: "/og/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Domaine des Élégances",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Domaine des Élégances",
    description:
      "Un lieu d'exception pour célébrer mariages et événements festifs.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased" data-theme="accueil" suppressHydrationWarning>
        {gtmId && (
          <>
            <Script id="gtm-script" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <RouteTracker />
        {children}
      </body>
    </html>
  );
}
