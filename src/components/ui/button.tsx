import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — primitive premium agnostique du thème.
 *
 * Rendu identique que le bouton soit rendu dans un contexte `accueil`,
 * `ceremonie` ou `festif` : tout passe par les variables CSS (tokens
 * sémantiques définis dans globals.css).
 *
 * Specs respectées :
 *   - coins légèrement arrondis (radius-md ≈ 4px), jamais rounded-full
 *   - CTA principal = fond doré plein + texte anthracite (clair) ou
 *     marine (festif) — le token --accent-foreground bascule tout seul
 *   - hover = luminosité légèrement diminuée, pas un simple opacity
 *   - état outline réservé aux actions secondaires
 *   - pas de shadow dure SaaS : shadow-soft (chaude) en thème clair,
 *     glow-accent (chaude dorée) en thème festif (cf. globals.css)
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-sans font-semibold tracking-[0.14em] uppercase",
    "transition-[background-color,color,box-shadow,filter] duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    "shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // CTA principal — fond doré plein
        primary: [
          "bg-accent-strong text-white",
          "shadow-soft hover:brightness-95 active:brightness-90",
        ].join(" "),
        primaryGlow: [
          "bg-accent-strong text-white",
          "glow-accent hover:brightness-105 active:brightness-95",
        ].join(" "),
        // Action secondaire — outline fin doré
        outline: [
          "border border-accent text-white bg-surface/15 backdrop-blur-sm",
          "hover:bg-accent/10",
        ].join(" "),
        // Lien discret (texte doré, underline au hover)
        link: [
          "bg-transparent text-accent-strong underline-offset-4",
          "normal-case tracking-normal hover:underline",
        ].join(" "),

        // ─── Alias de compatibilité shadcn ────────────────────────
        // Les composants shadcn existants (carousel, dropdown-menu, etc.)
        // utilisent des variants historiques. On les alias vers les
        // variants premium pour ne pas casser leur rendu. L'application
        // n'utilise pas ces alias directement — ils existent juste
        // pour la compat.
        default: [
          "bg-accent-strong text-accent-foreground",
          "shadow-soft hover:brightness-95",
        ].join(" "),
        ghost: [
          "bg-transparent text-ink hover:bg-accent/10",
          "normal-case tracking-normal",
        ].join(" "),
        secondary: [
          "bg-surface-alt text-ink border border-line",
          "hover:brightness-95 normal-case tracking-normal",
        ].join(" "),
        destructive: [
          "bg-[oklch(0.577_0.245_27.325)] text-white",
          "shadow-soft hover:brightness-95 normal-case tracking-normal",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 text-[0.7rem] rounded-[var(--radius-md)]",
        md: "h-11 px-6 text-xs rounded-[var(--radius-md)]",
        lg: "h-13 px-8 text-xs rounded-[var(--radius-md)]",
        // Taille « hero » pour les CTA pleine largeur de hero
        hero: "h-14 px-10 text-sm rounded-[var(--radius-md)]",
        // Alias de compat shadcn
        default: "h-11 px-6 text-xs rounded-[var(--radius-md)]",
        icon: "size-11 p-0 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
