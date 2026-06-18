"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "./ThemeProvider";

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line backdrop-blur-md bg-surface/85">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="group flex flex-col leading-none"
          aria-label="Domaine des Élégances — accueil"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span
            className="text-eyebrow text-ink"
            style={{ letterSpacing: "0.22em" }}
          >
            Domaine
          </span>
          <span
            className="text-eyebrow text-accent-strong mt-1"
            style={{ letterSpacing: "0.32em" }}
          >
            DES ÉLÉGANCES
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
          onClick={scrollToForm}
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
    <ThemeProvider theme={theme}>
      <Header />
    </ThemeProvider>
  );
}
