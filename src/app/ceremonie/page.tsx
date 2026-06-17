import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LeadFormCeremonie } from "@/components/forms/LeadFormCeremonie";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Cérémonie — Mariage & réception de prestige",
  description:
    "Célébrez votre mariage au Domaine des Élégances : cérémonie en plein air, réception élégante, hébergement sur place. Devis personnalisé sous 24h.",
  alternates: { canonical: "/ceremonie" },
  openGraph: {
    title: "Cérémonie — Mariage au Domaine des Élégances",
    description:
      "Un écrin lumineux pour échanger vos vœux. Coordination complète, hébergement sur place, élégance à chaque instant.",
    url: "/ceremonie",
    type: "website",
  },
};

export default function CeremoniePage() {
  return (
    <ThemeProvider
      theme="ceremonie"
      as="div"
      className="flex min-h-screen flex-col bg-surface"
    >
      <Header />

      <main className="flex-1">
        <Hero
          variant="ceremonie"
          eyebrow="Univers Cérémonie"
          title={
            <>
              Vos vœux,
              <br />
              notre écrin.
            </>
          }
          subtitle="Un domaine pensé pour les cérémonies d'exception : lumière naturelle, espaces arborés, salles de réception au raffinement sobre. Ici, chaque détail se tait pour ne laisser parler que l'instant."
          primaryCta={{
            href: "#devis",
            label: "Voir ma proposition",
          }}
          secondaryCta={{
            href: "/#orientation",
            label: "Revenir à l'accueil",
            variant: "outline",
          }}
          image={{
            src: "/images/ceremonie/hero-bg.jpeg",
            alt: "Cérémonie de mariage au Domaine des Élégances",
          }}
        />

        {/* Présentation du domaine */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
            <Badge variant="accent" className="mb-6">
              Le domaine
            </Badge>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
              Un lieu qui ne ressemble à aucun autre
            </h2>
            <p className="mt-8 text-base leading-relaxed text-ink-muted md:text-lg">
              Niché à quelques minutes de la ville, le Domaine des Élégances
              conjugue le charme d'une bâtisse d'époque et la rigueur d'un
              service haut de gamme. Parc arboré, salles baignées de lumière
              naturelle, hébergement intimiste pour les hôtes : chaque espace
              a été pensé pour absorber le tumulte d'une journée de
              cérémonie et ne garder que l'essentiel.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
              Nous n'accueillons qu'une célébration à la fois. C'est notre
              façon de garantir que votre journée vous appartient, du
              premier café du matin au dernier verre de la nuit.
            </p>
          </div>
        </section>

        {/* Capacités & hébergements */}
        <section className="border-y border-line bg-surface-alt py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="max-w-3xl">
              <Badge variant="accent" className="mb-6">
                Capacités & hébergements
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Des espaces qui s'adaptent à votre histoire
              </h2>
              <p className="mt-8 text-base leading-relaxed text-ink-muted md:text-lg">
                Du dîner intime au grand banquet, le domaine se module selon
                vos besoins. Les chiffres ci-dessous sont indicatifs — nous
                ajustons ensemble la configuration idéale.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  titre: "Salle de cérémonie",
                  capacite: "Jusqu'à 200 invités",
                  detail:
                    "Lumière zénithale, parquet d'origine, hauteur sous plafond de 5 m.",
                },
                {
                  titre: "Parc & terrasse",
                  capacite: "Cocktail jusqu'à 300 invités",
                  detail:
                    "Cérémonie laïque en extérieur, vin d'honneur sous les arbres.",
                },
                {
                  titre: "Hébergement sur place",
                  capacite: "20 chambres · 50 lits",
                  detail:
                    "Pour les proches et la famille, à quelques pas de la salle.",
                },
              ].map((item) => (
                <div
                  key={item.titre}
                  className="flex flex-col gap-3 border border-line bg-surface-elevated p-8 rounded-[var(--radius-lg)] shadow-soft"
                >
                  <h3 className="font-serif text-xl font-medium text-ink">
                    {item.titre}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                    {item.capacite}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Galerie */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 text-center">
              <Badge variant="accent" className="mb-6">
                Galerie
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Le domaine en images
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                Placeholders pour l'instant — nous remplacerons par les
                clichés du photographe officiel du domaine.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                "Salon de réception",
                "Parc arboré",
                "Salle de cérémonie",
              ].map((legende, index) => (
                <figure
                  key={legende}
                  className={`group relative overflow-hidden rounded-[var(--radius-lg)] border border-line ${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative bg-surface-alt ${
                      index === 0 ? "aspect-[16/10]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src="/placeholders/placeholder-light.svg"
                      alt={`${legende} — Domaine des Élégances`}
                      fill
                      sizes={
                        index === 0
                          ? "(min-width: 768px) 66vw, 100vw"
                          : "(min-width: 768px) 33vw, 100vw"
                      }
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-6 text-sm text-white">
                    {legende}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire Cérémonie */}
        <section
          id="devis"
          className="border-t border-line bg-surface-alt py-20 md:py-28"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="mb-12 text-center">
              <Badge variant="accent" className="mb-6">
                Demande de devis
              </Badge>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
                Préparons votre cérémonie
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                Quelques informations suffisent pour démarrer la
                conversation. Nous revenons vers vous sous 24h ouvrées avec
                une première proposition personnalisée.
              </p>
            </div>

            <div className="bg-surface-elevated border border-line rounded-[var(--radius-lg)] shadow-soft p-6 md:p-10">
              <LeadFormCeremonie />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </ThemeProvider>
  );
}
