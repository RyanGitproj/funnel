import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Domaine des Élégances — Lieu de prestige pour mariages et réceptions",
    template: "%s · Domaine des Élégances",
  },
  description:
    "Domaine des Élégances : un lieu d'exception pour célébrer mariages, EVJF, EVG et événements festifs. Deux univers, une même exigence d'élégance.",
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
        {children}
      </body>
    </html>
  );
}
