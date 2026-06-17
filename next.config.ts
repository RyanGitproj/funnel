import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
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
