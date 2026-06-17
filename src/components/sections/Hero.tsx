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
          <Link href={primary.href}>
            <CtaContent cta={primary} />
          </Link>
        </Button>
      )}
      {secondary && (
        <Button
          asChild
          size="hero"
          variant={secondary.variant ?? "outline"}
          className="w-full max-w-full whitespace-normal px-5 text-center sm:w-auto sm:whitespace-nowrap sm:px-10"
        >
          <Link href={secondary.href}>
            <CtaContent cta={secondary} />
          </Link>
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
  primaryCta,
  secondaryCta,
  image,
  accentImage,
  className,
}: SubHeroProps & { accentImage?: HeroImage }) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-surface md:min-h-[74vh]",
        className,
      )}
    >
      <div className="absolute inset-0 md:hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 0vw"
          className="object-cover opacity-20"
        />
      </div>

      <div className="absolute inset-y-0 left-0 hidden w-[36%] opacity-90 md:block">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="36vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-y-0 left-0 hidden w-[50%] bg-gradient-to-r from-transparent via-surface/55 to-surface md:block" />

      {accentImage && (
        <>
          <div className="absolute inset-y-0 right-0 hidden w-[35%] opacity-95 md:block">
            <Image
              src={accentImage.src}
              alt={accentImage.alt}
              fill
              sizes="(max-width: 767px) 0vw, 35vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[50%] bg-gradient-to-l from-transparent via-surface/55 to-surface md:block" />
        </>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,253,248,0.96)_0%,rgba(250,246,238,0.92)_43%,rgba(250,246,238,0.45)_72%,rgba(250,246,238,0)_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 text-center md:py-32">
        {eyebrow && (
          <Badge
            variant="accent"
            className="mb-8 max-w-full whitespace-normal text-center leading-relaxed"
          >
            {eyebrow}
          </Badge>
        )}
        <h1 className="max-w-full break-words font-serif text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl md:text-6xl lg:text-[72px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {subtitle}
          </p>
        )}
        <CtaRow primary={primaryCta} secondary={secondaryCta} />
      </div>
    </section>
  );
}

function HeroCeremonie({
  eyebrow,
  title,
  subtitle,
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
        <div className="max-w-2xl">
          {eyebrow && (
            <Badge
              variant="accent"
              className="mb-8 max-w-full whitespace-normal text-center leading-relaxed"
            >
              {eyebrow}
            </Badge>
          )}
          <h1 className="max-w-full break-words font-serif text-4xl font-semibold leading-[1.04] text-ink sm:text-5xl md:text-6xl lg:text-[70px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
              {subtitle}
            </p>
          )}
          <CtaRow primary={primaryCta} secondary={secondaryCta} align="left" />
        </div>
      </div>
    </section>
  );
}
