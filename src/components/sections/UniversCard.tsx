import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * UniversCard — carte de navigation vers un univers (Cérémonie / Festif).
 *
 * Pilotée par props, agnostique du thème (couleurs via tokens).
 * Le rendu visuel bascule automatiquement avec le data-theme ambiant :
 *   - en thème clair : ombre douce + bordure dorée fine
 *   - en thème festif : glow doré + bordure plus saturée
 *
 * Structure :
 *   - Image en haut (aspect 4/3) avec cadre doré interne
 *   - Badge eyebrow (catégorie)
 *   - Titre serif
 *   - Description
 *   - Lien d'action «→» doré en bas
 */
export interface UniversCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
  ctaLabel: string;
  className?: string;
}

export function UniversCard({
  eyebrow,
  title,
  description,
  href,
  image,
  ctaLabel,
  className,
}: UniversCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "bg-surface-elevated text-ink",
        "border border-line",
        "rounded-[var(--radius-lg)]",
        "shadow-soft glow-accent",
        "transition-[transform,box-shadow,filter] duration-300 ease-out",
        "hover:-translate-y-1 hover:brightness-[1.02]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        className,
      )}
    >
      {/* Image avec léger zoom au hover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-8 md:p-10">
        <Badge variant="accent" className="self-start">
          {eyebrow}
        </Badge>
        <h3 className="font-serif text-2xl font-medium leading-tight text-ink md:text-3xl">
          {title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {ctaLabel}
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
