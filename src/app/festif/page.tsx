import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { HeaderThemed } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LeadFormFestif } from "@/components/forms/LeadFormFestif";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Festif - EVJF, EVG & anniversaires chic",
  description:
    "EVJF, EVG, anniversaire ou week-end entre amis au Domaine des Élégances : un domaine privatisé pour célébrer entre proches dans un cadre élégant.",
  alternates: { canonical: "/festif" },
  openGraph: {
    title: "Festif - EVJF, EVG & anniversaires au Domaine des Élégances",
    description:
      "Un domaine privatisé pour vivre un moment fort entre proches, sans complexité et sous réserve de disponibilité.",
    url: "/festif",
    type: "website",
  },
};

const experiences = [
  {
    titre: "Activités sur demande",
    detail:
      "Animations et expériences adaptées à votre groupe et à l'ambiance recherchée.",
  },
  {
    titre: "Espaces modulables",
    detail:
      "Intérieurs et extérieurs pensés pour suivre le rythme de votre événement.",
  },
  {
    titre: "Ambiance festive",
    detail:
      "Chic, conviviale ou animée, toujours dans un cadre élégant.",
  },
  {
    titre: "Hébergement sur place",
    detail:
      "Jusqu'à 22 couchages maximum pour prolonger l'expérience avec les proches essentiels.",
  },
];

const galerie = [
  {
    src: "/images/festif/hero.jpg",
    alt: "Façade du domaine illuminée pour une soirée privée",
    legende: "Domaine privatisé",
  },
  {
    src: "/images/festif/hero-2.jpg",
    alt: "Espace piscine éclairé aux bougies pour une réception nocturne",
    legende: "Espaces nocturnes",
  },
  {
    src: "/images/festif/ambiance.jpg",
    alt: "Invitées dansant dans une ambiance festive au domaine",
    legende: "Ambiance entre proches",
  },
  {
    src: "/images/festif/sauna.jpg",
    alt: "Sauna privatif disponible sur place",
    legende: "Détente sur place",
  },
];

export default function FestifPage() {
  return (
    <ThemeProvider
      theme="festif"
      as="div"
      className="flex min-h-screen flex-col bg-surface"
    >
      <HeaderThemed theme="accueil" />

      <main className="flex-1">
        <Hero
          variant="festif"
          eyebrow="EVJF · EVG · Anniversaires · Week-ends"
          title="Célébrez entre proches, sans sacrifier le raffinement."
          subtitle="EVJF, EVG, anniversaire ou week-end entre amis : un domaine privatisé pensé pour vivre un moment fort sans complexité."
          microReassurance="Réponse sous 24h · Proposition personnalisée · Sous réserve de disponibilité"
          primaryCta={{
            href: "#devis",
            label: "Obtenir mon devis festif",
            variant: "primaryGlow",
          }}
          image={{
            src: "/images/ceremonie/pool-house-piscine-interieure.jpeg",
            alt: "Pool house et piscine intérieure du Domaine des Élégances",
          }}
        />

        <ThemeProvider
          theme="ceremonie"
          as="section"
          className="bg-surface py-20 md:py-28"
        >
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
            <Badge variant="accent" className="mb-6">
              EVJF · EVG · ANNIVERSAIRES
            </Badge>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
              Un lieu pensé pour profiter, sans gérer toute l'organisation
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-ink-muted md:text-lg">
              Vous privatisez un domaine pour vivre un moment entre proches
              dans un cadre élégant, fluide et simple à organiser. Nous
              adaptons la structure selon votre projet.
            </p>
          </div>
        </ThemeProvider>

        <section className="bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Une expérience qui s'adapte à votre groupe
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
                Le domaine garde le cadre. Votre groupe choisit le rythme.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {experiences.map((item) => (
                <div
                  key={item.titre}
                  className="border border-line bg-surface-elevated p-7 glow-accent"
                >
                  <h3 className="font-serif text-lg font-medium text-ink">
                    {item.titre}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-alt py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Badge variant="accent" className="mb-6">
                Aperçu du domaine
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Un cadre réel pour se projeter simplement
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
                Quelques images pour ressentir l'ambiance du lieu avant de
                préciser votre projet.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {galerie.map((image, index) => (
                <figure
                  key={image.src}
                  className={
                    index === 0
                      ? "group md:col-span-2 md:row-span-2"
                      : "group"
                  }
                >
                  <div
                    className={
                      index === 0
                        ? "relative aspect-[4/3] overflow-hidden border border-line bg-surface-elevated md:h-full"
                        : "relative aspect-[4/3] overflow-hidden border border-line bg-surface-elevated"
                    }
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={
                        index === 0
                          ? "(min-width: 768px) 50vw, 100vw"
                          : "(min-width: 768px) 25vw, 100vw"
                      }
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1b2b]/80 to-transparent p-4"
                      aria-hidden
                    />
                    <figcaption className="absolute bottom-4 left-4 right-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#f5f0e8]">
                      {image.legende}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <Badge variant="accent" className="mb-6">
                Ambiance en vidéo
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Vivez l'ambiance avant d'arriver
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
                Un aperçu réel du domaine pour vous projeter dans votre
                événement festif.
              </p>
            </div>

            <div className="overflow-hidden border border-line shadow-soft" style={{ aspectRatio: "16/9" }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/4u30fv4COk4"
                title="Aperçu du Domaine des Élégances — ambiance festive"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="h-full w-full"
              />
            </div>
          </div>
        </section>

        <ThemeProvider
          theme="festif"
          as="section"
          id="devis"
          className="bg-surface py-20 md:py-28"
        >
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="mb-12 text-center">
              <Badge variant="accent" className="mb-6">
                Demande de devis
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Préparez votre devis festif
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                Indiquez-nous votre projet : nous revenons vers vous avec une
                première proposition adaptée à votre date, à votre groupe et
                aux options souhaitées.
              </p>
            </div>

            <div className="border border-line bg-surface-elevated p-6 glow-accent md:p-10">
              <LeadFormFestif />
            </div>
          </div>
        </ThemeProvider>
      </main>

      <Footer description="Un domaine privé pour célébrer entre proches : EVJF, EVG, anniversaires et week-ends festifs dans un cadre élégant et confortable." />
    </ThemeProvider>
  );
}
