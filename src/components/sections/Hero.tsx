"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

export type HeroVariant = "accueil" | "ceremonie" | "festif";

export interface HeroCta {
  href: string;
  label: string;
  variant?: "primary" | "primaryGlow" | "outline";
  trackEvent?: string;
}

export interface HeroImage {
  src: string;
  alt: string;
}

export interface HeroProps {
  variant: HeroVariant;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  microReassurance?: React.ReactNode;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  image: HeroImage;
  accentImage?: HeroImage;
  className?: string;
}

interface SubHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  microReassurance?: React.ReactNode;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  image: HeroImage;
  className?: string;
}

function CtaContent({ cta }: { cta: HeroCta }) {
  return (
    <>
      {cta.label}
      <span aria-hidden className="text-base leading-none">
        &rarr;
      </span>
    </>
  );
}

function scrollToHash(href: string) {
  const id = href.startsWith("#") ? href.slice(1) : null;
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function CtaLink({ cta, className }: { cta: HeroCta; className?: string }) {
  if (cta.href.startsWith("#")) {
    return (
      <a
        href={cta.href}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          if (cta.trackEvent) pushDataLayerEvent(cta.trackEvent);
          scrollToHash(cta.href);
        }}
      >
        <CtaContent cta={cta} />
      </a>
    );
  }
  return (
    <Link
      href={cta.href}
      className={className}
      onClick={() => {
        if (cta.trackEvent) pushDataLayerEvent(cta.trackEvent);
      }}
    >
      <CtaContent cta={cta} />
    </Link>
  );
}

function CtaRow({
  primary,
  secondary,
  align = "center",
}: {
  primary?: HeroCta;
  secondary?: HeroCta;
  align?: "center" | "left";
}) {
  if (!primary && !secondary) return null;

  return (
    <div
      className={cn(
        "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
        align === "center" ? "items-center sm:justify-center" : "items-stretch",
      )}
    >
      {primary && (
        <Button
          asChild
          size="hero"
          variant={primary.variant ?? "primary"}
          className="w-full max-w-full whitespace-normal px-5 text-center sm:w-auto sm:whitespace-nowrap sm:px-10"
        >
          <CtaLink cta={primary} />
        </Button>
      )}
      {secondary && (
        <Button
          asChild
          size="hero"
          variant={secondary.variant ?? "outline"}
          className="w-full max-w-full whitespace-normal px-5 text-center sm:w-auto sm:whitespace-nowrap sm:px-10"
        >
          <CtaLink cta={secondary} />
        </Button>
      )}
    </div>
  );
}

export function Hero({
  variant,
  eyebrow,
  title,
  subtitle,
  microReassurance,
  primaryCta,
  secondaryCta,
  image,
  accentImage,
  className,
}: HeroProps) {
  if (variant === "festif") {
    return (
      <HeroFestif
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        microReassurance={microReassurance}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        image={image}
        className={className}
      />
    );
  }

  if (variant === "ceremonie") {
    return (
      <HeroCeremonie
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        microReassurance={microReassurance}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        image={image}
        className={className}
      />
    );
  }

  return (
    <HeroAccueil
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      microReassurance={microReassurance}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      image={image}
      accentImage={accentImage}
      className={className}
    />
  );
}

/**
 * Section de couverture partagée par les trois heros : photo pleine largeur
 * de hauteur uniforme — 70 % de l'écran sur mobile, 80 % sur desktop.
 * Le padding vertical du contenu est volontairement compact pour que le
 * contenu le plus haut (accueil : 2 CTA + long sous-titre) tienne DANS ce
 * pourcentage aux tailles d'écran courantes. Résultat : toutes les heros
 * atteignent exactement le même pourcentage → hauteurs identiques et images
 * alignées. `min-h` (et non `h` fixe) garantit qu'aucun texte n'est tronqué
 * si l'écran est plus court que le contenu (le hero grandit au lieu de couper).
 *
 * L'image remonte derrière le header (`-mt-20` = hauteur du header `h-20`)
 * pour éviter la coupure nette sous le menu ; `pt-20` maintient le contenu
 * sous le header. Voir Header.tsx (sticky, semi-transparent + blur).
 */
function HeroCoverFrame({
  image,
  children,
  className,
}: {
  image: HeroImage;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate -mt-20 flex min-h-[70svh] items-center overflow-hidden pt-20 md:min-h-[80vh]",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Voile de lisibilité multi-couches (gradient + vignette), piloté
          par le token --hero-overlay du thème ambiant (cf. globals.css) */}
      <div
        aria-hidden
        className="absolute inset-0 [background-image:var(--hero-overlay)]"
      />
      {children}
    </section>
  );
}

function HeroAccueil({
  eyebrow,
  title,
  subtitle,
  microReassurance,
  primaryCta,
  secondaryCta,
  image,
  className,
}: SubHeroProps & { accentImage?: HeroImage }) {
  return (
    <HeroCoverFrame image={image} className={className}>
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-4 text-center">
        {eyebrow && (
          <Badge
            variant="accent"
            className="mb-6 max-w-full whitespace-normal text-center leading-relaxed"
          >
            {eyebrow}
          </Badge>
        )}
        <h1 className="mx-auto max-w-[20rem] break-words font-serif text-[1.75rem] leading-[1.1] tracking-normal text-white [text-shadow:0_2px_14px_rgba(10,8,5,0.55),0_4px_28px_rgba(10,8,5,0.30)] sm:max-w-2xl sm:text-[2.1rem] md:max-w-3xl md:text-[2.8rem] md:leading-[1.06] lg:text-[3.3rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-white [text-shadow:0_1px_4px_rgba(0,0,0,1),0_2px_12px_rgba(0,0,0,0.92),0_4px_24px_rgba(0,0,0,0.75),0_0_48px_rgba(0,0,0,0.50)] md:text-lg">
            {subtitle}
          </p>
        )}
        <CtaRow primary={primaryCta} secondary={secondaryCta} />
        {microReassurance && (
          <p className="mx-auto mt-5 max-w-2xl text-xs leading-relaxed text-white/65 md:text-sm">
            {microReassurance}
          </p>
        )}
      </div>
    </HeroCoverFrame>
  );
}

function HeroCeremonie({
  eyebrow,
  title,
  subtitle,
  microReassurance,
  primaryCta,
  secondaryCta,
  image,
  className,
}: SubHeroProps) {
  return (
    <HeroCoverFrame image={image} className={className}>
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-4 text-center">
        {eyebrow && (
          <Badge
            variant="accent"
            className="mb-5 max-w-full whitespace-normal text-center leading-relaxed"
          >
            {eyebrow}
          </Badge>
        )}
        <h1 className="mx-auto max-w-full break-words font-serif text-[1.75rem] leading-[1.1] text-white [text-shadow:0_2px_14px_rgba(10,8,5,0.55),0_4px_28px_rgba(10,8,5,0.28)] sm:text-[2.1rem] md:text-[2.8rem] md:leading-[1.06] lg:text-[3.3rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white [text-shadow:0_1px_4px_rgba(0,0,0,1),0_2px_12px_rgba(0,0,0,0.92),0_4px_24px_rgba(0,0,0,0.75),0_0_48px_rgba(0,0,0,0.50)] md:text-lg">
            {subtitle}
          </p>
        )}
        <CtaRow primary={primaryCta} secondary={secondaryCta} />
        {microReassurance && (
          <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-white/70 [text-shadow:0_1px_5px_rgba(0,0,0,0.90),0_2px_14px_rgba(0,0,0,0.65)] md:text-sm">
            {microReassurance}
          </p>
        )}
      </div>
    </HeroCoverFrame>
  );
}

function HeroFestif({
  eyebrow,
  title,
  subtitle,
  microReassurance,
  primaryCta,
  secondaryCta,
  image,
  className,
}: SubHeroProps) {
  return (
    <HeroCoverFrame image={image} className={className}>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-4 lg:px-10">
        <div className="max-w-[21.5rem] sm:max-w-2xl">
          {eyebrow && (
            <Badge
              variant="accent"
              className="mb-6 max-w-full whitespace-normal text-center leading-relaxed"
            >
              {eyebrow}
            </Badge>
          )}
          <h1 className="max-w-full break-words font-serif text-[1.85rem] leading-[1.08] sm:text-[2.3rem] md:text-[2.9rem] lg:text-[3.5rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
              {subtitle}
            </p>
          )}
          <CtaRow primary={primaryCta} secondary={secondaryCta} align="left" />
          {microReassurance && (
            <p className="mt-5 max-w-xl text-xs leading-relaxed text-ink-subtle md:text-sm">
              {microReassurance}
            </p>
          )}
        </div>
      </div>
    </HeroCoverFrame>
  );
}
