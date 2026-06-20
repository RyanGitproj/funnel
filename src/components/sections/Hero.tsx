"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroVariant = "accueil" | "ceremonie" | "festif";

export interface HeroCta {
  href: string;
  label: string;
  variant?: "primary" | "primaryGlow" | "outline";
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
          scrollToHash(cta.href);
        }}
      >
        <CtaContent cta={cta} />
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
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
        "mt-10 flex flex-col gap-4 sm:flex-row sm:items-center",
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
    <section
      className={cn(
        "relative isolate flex min-h-[82svh] items-center justify-center overflow-hidden md:min-h-[90vh]",
        className,
      )}
    >
      {/* Image plein cadre — mobile et desktop */}
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Voile sombre gradué — lisibilité du texte blanc */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/32 to-black/58"
        aria-hidden
      />
      {/* Vignette latérale douce pour concentrer le regard au centre */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_42%,rgba(12,9,5,0.38)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-24 text-center md:py-40">
        {eyebrow && (
          <Badge
            variant="accent"
            className="mb-8 max-w-full whitespace-normal text-center leading-relaxed"
          >
            {eyebrow}
          </Badge>
        )}
        <h1 className="mx-auto max-w-[22rem] break-words font-serif text-[2.1rem] font-bold leading-[1.08] tracking-normal text-[#fffdf8] [text-shadow:0_2px_14px_rgba(10,8,5,0.55),0_4px_28px_rgba(10,8,5,0.30)] sm:max-w-2xl sm:text-4xl md:max-w-3xl md:text-[3.6rem] md:font-semibold md:leading-[1.05] lg:text-[72px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-8 max-w-2xl rounded-xl px-6 py-4 text-base leading-[1.8] text-ink bg-white/92 backdrop-blur-md md:px-8 md:py-5 md:text-lg">
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
    </section>
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
    <section
      className={cn(
        "relative overflow-hidden py-16 md:py-24 lg:py-28",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(194,163,104,0.16),transparent_28%),linear-gradient(180deg,rgba(255,253,248,0.9),rgba(250,246,238,0.98))]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-10">
        <div className="order-2 lg:order-1">
          {eyebrow && (
            <Badge
              variant="accent"
              className="mb-6 max-w-full whitespace-normal text-center leading-relaxed"
            >
              {eyebrow}
            </Badge>
          )}
          <h1 className="max-w-full break-words font-serif text-4xl font-semibold leading-[1.08] text-ink md:text-5xl lg:text-[62px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
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

        <div className="order-1 lg:order-2">
          <div className="rounded-[var(--radius-xl)] border border-accent/45 bg-surface-elevated p-2 shadow-soft">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[var(--radius-md)] bg-surface-alt lg:aspect-[5/4]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
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
    <section
      className={cn(
        "relative isolate flex min-h-[88vh] items-center overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0c1424]/92 via-[#101827]/70 to-[#101827]/22"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-[#111827]/35"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 lg:px-10">
        <div className="max-w-[21.5rem] sm:max-w-2xl">
          {eyebrow && (
            <Badge
              variant="accent"
              className="mb-8 max-w-full whitespace-normal text-center leading-relaxed"
            >
              {eyebrow}
            </Badge>
          )}
          <h1 className="max-w-full break-words font-serif text-[2.45rem] font-semibold leading-[1.04] text-ink sm:text-5xl md:text-6xl lg:text-[70px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
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
    </section>
  );
}
