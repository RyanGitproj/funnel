import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import Image from "next/image";
import { Clock, Sparkles, HeartHandshake, MapPinned } from "lucide-react";

export const metadata: Metadata = {
  title: "Domaine des Élégances — Choisir votre univers",
  description:
    "Un domaine privé pour cérémonies, week-ends festifs et événements familiaux. Choisissez entre l'univers Cérémonie et l'univers Festif.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Domaine des Élégances — Choisir votre univers",
    description:
      "Une page d'entrée unique pour choisir le bon parcours : Cérémonie ou Festif.",
    url: "/",
    type: "website",
  },
};

const reassuranceItems = [
  {
    icon: Clock,
    title: "Réponse sous 24h",
    description:
      "Chaque demande est étudiée rapidement pour vous orienter vers le bon format et les prochaines étapes.",
  },
  {
    icon: Sparkles,
    title: "Devis personnalisé",
    description:
      "Votre proposition est préparée selon votre type d'événement, votre date, le nombre de participants et les options souhaitées.",
  },
  {
    icon: HeartHandshake,
    title: "Accompagnement dédié",
    description:
      "Un interlocuteur reprend votre demande pour confirmer les détails importants avant validation finale.",
  },
  {
    icon: MapPinned,
    title: "Domaine privé",
    description:
      "Un cadre confidentiel dans les Yvelines, pensé pour recevoir vos proches dans une atmosphère élégante et maîtrisée.",
  },
];

export default function HomePage() {
  return (
    <ThemeProvider
      theme="accueil"
      as="div"
      className="flex min-h-screen flex-col bg-surface"
    >
      <Header />

      <main className="flex-1">
        <Hero
          variant="accueil"
          title={
            <>
              Un domaine privé pour célébrer
              <br className="hidden md:block" />{" "}
              ce qui compte vraiment.
            </>
          }
          subtitle="Mariage, cérémonie familiale, enterrement de vie de jeune fille, enterrement de vie de garçon ou anniversaire : choisissez votre univers, nous préparons un parcours adapté à votre projet."
          primaryCta={{
            href: "#orientation",
            label: "CHOISIR MON UNIVERS",
            trackEvent: "homepage_orientation_click",
          }}
          image={{
            src: "/images/ceremonie/hero-bg.jpeg",
            alt: "Vue panoramique du Domaine des Élégances",
          }}
          accentImage={{
            src: "/images/ceremonie/reception-barnum-nuit.jpeg",
            alt: "Réception privée nocturne au Domaine des Élégances",
          }}
        />

        <section
          id="orientation"
          className="scroll-mt-20 border-y border-line bg-surface-alt py-16 md:py-24"
        >
          <div className="mx-auto max-w-2xl px-6 lg:px-10">
            <div className="flex flex-col items-center">

              {/* Boîte de bienvenue */}
              <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-accent/45 bg-surface-elevated px-10 py-8 text-center shadow-soft">
                <span className="text-accent/80" aria-hidden style={{ fontSize: "0.75rem", letterSpacing: "0.12em" }}>◆</span>
                <p className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink">
                  Bienvenue au{" "}
                  <span className="whitespace-nowrap text-accent-strong">Domaine des Élégances</span>
                </p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                  Choisissez votre univers pour commencer.
                </p>
              </div>

              {/* Tige verticale */}
              <div className="h-8 w-px bg-accent/40" />

              {/* Branche en V — toujours visible */}
              <div className="flex w-full">
                <div className="h-8 flex-1 rounded-tr-2xl border-r border-t border-accent/35" />
                <div className="h-8 flex-1 rounded-tl-2xl border-l border-t border-accent/35" />
              </div>

              {/* Deux boutons — toujours côte à côte */}
              <div className="flex w-full flex-row gap-3 sm:gap-6">

                {/* Cérémonie */}
                <TrackedLink
                  href="/ceremonie"
                  event="homepage_card_ceremonie_click"
                  className="group flex flex-1 flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-accent/35 bg-surface-elevated px-3 py-8 text-center shadow-soft transition-all duration-300 hover:border-accent hover:shadow-[0_16px_48px_-16px_rgba(168,137,92,0.30)] sm:gap-6 sm:px-10 sm:py-12"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-accent/50 shadow-soft ring-4 ring-accent/10 sm:h-28 sm:w-28">
                    <Image
                      src="/images/ceremonie/reception-barnum-nuit.jpeg"
                      alt="Univers Cérémonie — Domaine des Élégances"
                      fill
                      sizes="(max-width: 640px) 80px, 112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  </div>
                  <p className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-accent-strong sm:text-[0.63rem] sm:tracking-[0.30em]">
                    Cérémonie
                  </p>
                  <h3 className="font-serif text-lg font-semibold leading-tight text-ink sm:text-[1.85rem]">
                    Mariages &amp;<br />cérémonies
                  </h3>
                  <div className="h-px w-8 bg-accent/55 sm:w-10" />
                  <ul className="flex flex-col gap-1 font-sans text-xs leading-relaxed text-ink-muted sm:gap-2 sm:text-sm">
                    <li>Mariage</li>
                    <li>Communion</li>
                    <li>Bar Mitzvah</li>
                  </ul>
                  <span className="mt-1 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-accent-strong sm:mt-2 sm:text-[0.63rem] sm:tracking-[0.20em]">
                    Préparer mon projet
                    <span aria-hidden className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </TrackedLink>

                {/* Festif */}
                <TrackedLink
                  href="/festif"
                  event="homepage_card_festif_click"
                  className="group flex flex-1 flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-accent/35 bg-surface-elevated px-3 py-8 text-center shadow-soft transition-all duration-300 hover:border-accent hover:shadow-[0_16px_48px_-16px_rgba(168,137,92,0.30)] sm:gap-6 sm:px-10 sm:py-12"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-accent/50 shadow-soft ring-4 ring-accent/10 sm:h-28 sm:w-28">
                    <Image
                      src="/images/ceremonie/pool-house-piscine-interieure.jpeg"
                      alt="Univers Festif — Domaine des Élégances"
                      fill
                      sizes="(max-width: 640px) 80px, 112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  </div>
                  <p className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-accent-strong sm:text-[0.63rem] sm:tracking-[0.30em]">
                    Festif
                  </p>
                  <h3 className="font-serif text-lg font-semibold leading-tight text-ink sm:text-[1.85rem]">
                    Réceptions &amp;<br />célébrations
                  </h3>
                  <div className="h-px w-8 bg-accent/55 sm:w-10" />
                  <ul className="flex flex-col gap-1 font-sans text-xs leading-relaxed text-ink-muted sm:gap-2 sm:text-sm">
                    <li>Enterrements de vie</li>
                    <li>Anniversaire</li>
                    <li>Fête entre amis</li>
                  </ul>
                  <span className="mt-1 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-accent-strong sm:mt-2 sm:text-[0.63rem] sm:tracking-[0.20em]">
                    Découvrir le festif
                    <span aria-hidden className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </TrackedLink>

              </div>
            </div>
          </div>
        </section>

        <ReassuranceBar items={reassuranceItems} />
      </main>

      <Footer description="Un domaine privé pour cérémonies, week-ends festifs et événements familiaux, avec deux parcours de demande adaptés à votre projet." />
    </ThemeProvider>
  );
}
