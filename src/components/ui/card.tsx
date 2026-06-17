import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card — primitive premium agnostique du thème.
 *
 * - Thème clair : surface elevée (blanc cassé), bordure dorée fine à
 *   faible opacité (token --line), ombre douce chaude (.shadow-soft).
 * - Thème Festif : pas d'ombre portée classique (invisible sur fond
 *   sombre) — on applique .glow-accent qui produit un halo doré
 *   discret. La bordure --line reste (dorée fine à faible opacité).
 *
 * Toute la magie du basculement de thème vit dans globals.css ; ce
 * composant ne contient aucune couleur en dur.
 */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Fond + texte via tokens sémantiques
        "bg-surface-elevated text-ink",
        // Bordure dorée fine (token --line)
        "border border-line",
        // Rayon cohérent avec les boutons
        "rounded-[var(--radius-lg)]",
        // Ombre douce (chaude) en thème clair ; glow doré en Festif
        "shadow-soft glow-accent",
        // Layout
        "flex flex-col gap-6 p-6 md:p-8",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "font-serif text-2xl font-medium leading-tight text-ink",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-ink-muted", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-4 text-sm", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-2", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
