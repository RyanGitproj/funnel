import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Sitemap dynamique — génère la liste des routes publiques avec leur
 * date de dernière modification. Pages publiques uniquement : la page
 * /confirmation est volontairement exclue (page transitoire post-
 * formulaire, sans valeur d'indexation).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/ceremonie", changeFrequency: "monthly", priority: 0.9 },
    { path: "/festif", changeFrequency: "monthly", priority: 0.9 },
    { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.1 },
    {
      path: "/politique-de-confidentialite",
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
