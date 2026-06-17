import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LeadFormFestif } from "@/components/forms/LeadFormFestif";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Festif — EVJF, EVG & anniversaires chic",
  description:
    "Fêtez votre EVJF, EVG ou anniversaire au Domaine des Élégances : ambiance nocturne chic, activités sur mesure, espaces modulables. Devis personnalisé sous 24h.",
  alternates: { canonical: "/festif" },
  openGraph: {
    title: "Festif — EVJF, EVG & anniversaires au Domaine des Élégances",
    description:
      "Quand la nuit devient élégance. Espaces modulables, activités sur mesure, ambiance nocturne chic pour célébrer entre proches.",
    url: "/festif",
    type: "website",
  },
};

const activites = [
  {
    titre: "Activités sur mesure",
    detail:
      "Ateliers œnologie, mixologie, parfum, cuisine : des expériences pensées pour votre groupe.",
  },
  {
    titre: "Espaces modulables",
    detail:
      "Salon lounge, piste de danse, bar éphémère, espace photo : la nuit prend la forme que vous voulez.",
  },
  {
    titre: "Ambiance nocturne",
    detail:
      "Lumière chaude, sonorisation soignée, équipe discrète : le décor d'une soirée qui s'étire.",
  },
  {
    titre: "Hébergement inclus",
    detail:
      "Chambres pour les convives qui prolongent l'instant, petit-déjeuner lent le lendemain.",
  },
];

export default function FestifPage() {
  return (
    <ThemeProvider
      theme="festif"
      as="div"
      className="flex min-h-screen flex-col bg-surface"
    >
      <Header />

      <main className="flex-1">
        {/* Hero Festif — pleine largeur, overlay marine, CTA doré */}
        <Hero
          variant="festif"
          eyebrow="Univers Festif · Nuits d'élégance"
          title={
            <>
              Quand la nuit
              <br />
              devient élégance.
            </>
          }
          subtitle="EVJF, EVG, anniversaires — un cadre qui transforme une soirée entre proches en moment d'exception. Ambiance nocturne chic, sans jamais tomber dans l'ostentatoire."
          primaryCta={{
            href: "#devis",
            label: "Obtenir mon devis festif",
          }}
          secondaryCta={{
            href: "/#orientation",
            label: "Revenir à l'accueil",
            variant: "outline",
          }}
          image={{
            src: "/images/festif/barnum.jpg",
            alt: "Ambiance festive nocturne au Domaine des Élégances",
          }}
        />

        {/* Bande claire — EVJF / EVG / Anniversaires (respiration) */}
        <ThemeProvider
          theme="ceremonie"
          as="section"
          className="bg-surface py-20 md:py-28"
        >
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
            <Badge variant="accent" className="mb-6">
              EVJF · EVG · Anniversaires
            </Badge>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
              Célébrer entre proches, sans sacrifier le raffinement
            </h2>
            <p className="mt-8 text-base leading-relaxed text-ink-muted md:text-lg">
              Un enterrement de vie de garçon, un anniversaire marquant, un
              EVJF qui se prolonge en nuit blanche : ces moments méritent
              mieux qu'une salle louée à l'heure. Le Domaine des Élégances
              ouvre ses portes pour une soirée entière, sans voisins, sans
              curieux, sans précipitation.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
              Notre équipe coordonne l'ensemble : traiteur, activités,
              décoration lumineuse, gestion des flux. Vous êtes là pour
              célébrer — nous sommes là pour le reste.
            </p>
          </div>
        </ThemeProvider>

        {/* Bande sombre — Activités & espaces (grille serrée) */}
        <section className="bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 max-w-3xl">
              <Badge variant="accent" className="mb-6">
                Activités & espaces
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Une nuit qui prend la forme de votre idée
              </h2>
              <p className="mt-8 text-base leading-relaxed text-ink-muted md:text-lg">
                Ateliers, dîner, piste de danse, bar éphémère : les espaces
                s'enchaînent sans rupture d'ambiance. Tout est pensé pour
                que vos invités restent dans l'instant.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activites.map((item) => (
                <div
                  key={item.titre}
                  className="flex flex-col gap-3 border border-line bg-surface-elevated p-8 rounded-[var(--radius-lg)] glow-accent"
                >
                  <h3 className="font-serif text-lg font-medium text-ink">
                    {item.titre}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Galerie ambiance — grille d'images serrée */}
        <section className="bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 text-center">
              <Badge variant="accent" className="mb-6">
                Galerie ambiance
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                L'ambiance en quelques images
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                Placeholders — à remplacer par les clichés des dernières
                soirées du domaine.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { legende: "Salon lounge", tall: true },
                { legende: "Bar éphémère", tall: false },
                { legende: "Piste de danse", tall: false },
                { legende: "Espace photo", tall: false },
                { legende: "Coucher de lumière", tall: true },
                { legende: "Dernier verre", tall: false },
              ].map((item) => (
                <figure
                  key={item.legende}
                  className={`group relative overflow-hidden rounded-[var(--radius-lg)] border border-line ${
                    item.tall ? "sm:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative bg-surface-alt ${
                      item.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src="/placeholders/placeholder-dark.svg"
                      alt={`${item.legende} — Domaine des Élégances`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 text-sm text-white">
                    {item.legende}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Bande claire — Formulaire Festif */}
        <ThemeProvider
          theme="ceremonie"
          as="section"
          id="devis"
          className="bg-surface py-20 md:py-28"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="mb-12 text-center">
              <Badge variant="accent" className="mb-6">
                Demande de devis
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Organisons votre soirée
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                Dites-nous qui vous êtes, ce que vous imaginez, et nous
                revenons vers vous sous 24h avec une première proposition
                d'organisation — sans engagement.
              </p>
            </div>

            <div className="bg-surface-elevated border border-line rounded-[var(--radius-lg)] shadow-soft p-6 md:p-10">
              <LeadFormFestif />
            </div>
          </div>
        </ThemeProvider>
      </main>

      <Footer />
    </ThemeProvider>
  );
}
