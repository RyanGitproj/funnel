import * as React from "react";

export type ThemeName = "accueil" | "ceremonie" | "festif";

/**
 * ThemeProvider — applique l'attribut `data-theme` sur un wrapper
 * englobant ses enfants.
 *
 * Choix d'implémentation (Server Component pur, pas de contexte React) :
 *
 *   Le besoin est purement cosmétique : faire cascade les variables CSS
 *   du thème pour toute la sous-arborescence. Aucun état, aucun toggle
 *   runtime, aucune logique côté client. Un simple attribut HTML posé
 *   côté serveur suffit — c'est l'option la plus SSR-friendly, la plus
 *   légère (zéro JS), et elle reste 100 % typée.
 *
 *   Un contexte React serait justifié si on voulait basculer de thème
 *   en live (toggle clair/sombre par exemple). Ce n'est pas le cas ici
 *   — chaque route a un thème fixe, défini à la compilation.
 *
 *   Le `displayName` aide au débogage React DevTools.
 *
 *   Les props HTML natives (`id`, `aria-*`, `style`, etc.) sont
 *   forwardées au wrapper sous-jacent via `...rest`, ce qui permet
 *   d'utiliser ThemeProvider directement comme un <section id="devis">.
 */
export function ThemeProvider({
  theme,
  children,
  className,
  as: Tag = "div",
  ...rest
}: {
  theme: ThemeName;
  children: React.ReactNode;
  className?: string;
  /** Permet de rendre le wrapper en <main>, <section>, etc. si besoin. */
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag data-theme={theme} className={className} {...rest}>
      {children}
    </Tag>
  );
}

ThemeProvider.displayName = "ThemeProvider";
