import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  // Tests multi-postes du serveur dev via tunnel VS Code (*.devtunnels.ms) :
  // le proxy du tunnel réécrit le Host en localhost:3000, ce qui déclenche la
  // protection CSRF des Server Actions (Origin ≠ Host). Dev uniquement — en
  // prod (Render), Origin et X-Forwarded-Host portent le même domaine public.
  ...(process.env.NODE_ENV === "development"
    ? {
        experimental: {
          serverActions: {
            allowedOrigins: ["*.devtunnels.ms"],
          },
        },
      }
    : {}),
  // Les placeholders visuels sont des SVG locaux générés côté projet
  // (pas de contenu utilisateur) : on autorise leur optimisation par
  // next/image sans risque de sécurité.
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
