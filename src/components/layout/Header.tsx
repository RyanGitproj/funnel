"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * Header — commun à toutes les pages, fond vert domaine (charte p.6 :
 * header #1F3A2E, logo doré, bouton devis doré #C9A45C texte #1C1C1C).
 * Il pose lui-même `data-theme="dark"` pour consommer les tokens
 * sombres quel que soit le thème de la page.
 *
 * Volontairement minimal (trafic publicitaire) : logo + CTA devis,
 * aucun lien de navigation pour ne pas disperser le visiteur.
 *
 * Conventions premium :
 *   - lettres majuscules espacées (text-eyebrow) pour le logo
 *   - sticky top avec fond surface semi-transparent + blur discret
 */
export function Header() {
  const pathname = usePathname();
  const isCeremonie = pathname === "/ceremonie";
  const isFestif = pathname === "/festif";
  const isFunnel = isCeremonie || isFestif;

  const scrollToForm = (e: React.MouseEvent) => {
    if (!isFunnel) return;
    e.preventDefault();
    document.getElementById("devis")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuoteCtaClick = (e: React.MouseEvent) => {
    pushDataLayerEvent("header_quote_cta_click", { source_page: pathname });
    scrollToForm(e);
  };

  return (
    <header
      data-theme="dark"
      className="sticky top-0 z-40 w-full border-b border-line backdrop-blur-md bg-surface/85"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Domaine des Élégances — accueil"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/40 transition-shadow duration-300 group-hover:ring-accent/70 md:size-12">
            <Image
              src="/images/brand/embleme.png"
              alt=""
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </span>
          <span className="flex flex-col items-start gap-[4px] leading-none">
            <span
              className="font-serif text-[1.15rem] tracking-[0.12em] text-accent transition-colors duration-300 group-hover:text-accent-strong"
            >
              Domaine des Élégances
            </span>
            <div className="flex w-full items-center gap-1.5">
              <div className="h-px flex-1 bg-accent/40 transition-colors duration-300 group-hover:bg-accent/65" />
              <span aria-hidden className="text-accent/50 transition-colors duration-300 group-hover:text-accent" style={{ fontSize: "0.36rem", lineHeight: 1 }}>◆</span>
              <div className="h-px flex-1 bg-accent/40 transition-colors duration-300 group-hover:bg-accent/65" />
            </div>
            <span
              className="font-sans text-[0.52rem] font-medium uppercase tracking-[0.30em] text-accent-strong/80 transition-colors duration-300 group-hover:text-accent-strong"
            >
              Domaine privé · Yvelines
            </span>
          </span>
        </Link>

        <Link
          href={isFunnel ? "#devis" : "/#orientation"}
          onClick={handleQuoteCtaClick}
          className="inline-flex bg-accent px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground transition-colors hover:brightness-95 md:px-6 md:py-3 md:text-xs"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <span className="md:hidden">MON DEVIS</span>
          <span className="hidden md:inline">OBTENIR MON DEVIS</span>
        </Link>
      </div>
    </header>
  );
}
