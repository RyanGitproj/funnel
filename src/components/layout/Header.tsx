"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * Header — commun à toutes les pages, agnostique du thème.
 * Il consomme les variables CSS du contexte `data-theme` ambiant.
 *
 * Conventions premium :
 *   - lettres majuscules espacées (text-eyebrow) pour le logo
 *   - liens en sans-serif fine, jamais de bouton pour la nav
 *   - sticky top avec fond surface semi-transparent + blur discret
 */
const navLinks = [
  { href: "/ceremonie", label: "Cérémonie" },
  { href: "/festif", label: "Festif" },
  { href: "/#contact", label: "Contact" },
];

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
    <header className="sticky top-0 z-40 w-full border-b border-line backdrop-blur-md bg-surface/85">
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
              className="font-serif text-[1.15rem] font-medium tracking-[0.12em] text-accent transition-colors duration-300 group-hover:text-accent-strong"
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

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={isFunnel ? "#devis" : "/#orientation"}
          onClick={handleQuoteCtaClick}
          className={`bg-accent-strong text-accent-foreground font-semibold uppercase tracking-[0.18em] transition-colors hover:brightness-95${isFunnel ? " inline-flex px-4 py-2.5 text-[10px] md:px-6 md:py-3 md:text-xs" : " hidden px-6 py-3 text-xs md:inline-flex"}`}
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <span className="md:hidden">MON DEVIS</span>
          <span className="hidden md:inline">OBTENIR MON DEVIS</span>
        </Link>
      </div>
    </header>
  );
}

/**
 * HeaderThemed — wrapper pratique qui pose le thème AVANT le Header,
 * au cas où une page voudrait garantir son thème dès le sticky header
 * (utile pour Festif dont le header doit être sombre, même si le
 * scroll remonte sur la partie claire).
 *
 * En pratique les pages posent déjà <ThemeProvider> autour de tout
 * leur contenu, donc on utilise surtout <Header /> directement.
 */
export function HeaderThemed({ theme }: { theme: "accueil" | "ceremonie" | "festif" }) {
  return (
    <div data-theme={theme} style={{ display: "contents" }}>
      <Header />
    </div>
  );
}
