import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LeadFormCeremonie } from "@/components/forms/LeadFormCeremonie";
import { ContactGate } from "@/components/forms/ContactGate";
import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import {
  CONTACT_ID_COOKIE,
  isValidContactId,
} from "@/lib/contact/contactCookie";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Cérémonie — Devis personnalisé",
  description:
    "Mariage, baptême, communion, Bar Mitzvah ou événement familial élégant : préparez votre devis cérémonie au Domaine des Élégances, proche Paris et Versailles.",
  alternates: { canonical: "/ceremonie" },
  openGraph: {
    title: "Cérémonie — Domaine des Élégances",
    description:
      "Un domaine privé premium dans les Yvelines pour réunir vos proches dans un cadre élégant, rassurant et privatisable.",
    url: "/ceremonie",
    type: "website",
  },
};

const capacityCards = [
  {
    title: "Réception & cérémonie",
    subtitle: "Jusqu'à 80 personnes selon configuration",
    text: "Un cadre adapté aux mariages, cérémonies familiales, baptêmes, communions et Bar Mitzvah, avec une organisation ajustée selon le format retenu.",
  },
  {
    title: "Domaine privé de 5 hectares",
    subtitle: "Jardin, terrasse et espaces extérieurs",
    text: "Un environnement calme et confidentiel pour accueillir vos proches, créer des temps forts et profiter d'un cadre naturel proche de Paris et Versailles.",
  },
  {
    title: "Hébergement sur place",
    subtitle: "22 couchages maximum",
    text: "La bâtisse principale et les deux dépendances autonomes permettent d'héberger les proches essentiels, sans laisser penser que tous les invités dorment sur place.",
  },
  {
    title: "Espaces de confort",
    subtitle: "Piscine, sauna, salon et extérieurs",
    text: "Des espaces complémentaires permettent de prolonger l'expérience avant ou après la cérémonie, selon le format du séjour.",
  },
];

const supportBlocks = [
  {
    title: "Projet structuré",
    text: "Nous reprenons votre demande pour comprendre le format exact de votre cérémonie.",
  },
  {
    title: "Devis personnalisé",
    text: "La proposition tient compte de votre date, du nombre d'invités, de l'hébergement et des options souhaitées.",
  },
  {
    title: "Validation finale",
    text: "Chaque proposition reste transmise sous réserve de disponibilité et de validation par l'équipe.",
  },
];

const galleryImages = [
  {
    src: "/images/ceremonie/parc-du-domaine.jpeg",
    alt: "Parc arboré du Domaine des Élégances",
    caption: "Parc arboré",
    featured: true,
  },
  {
    src: "/images/ceremonie/grande salle.jpeg",
    alt: "Salle de réception du Domaine des Élégances",
    caption: "Salle de réception",
  },
  {
    src: "/images/ceremonie/veranda.jpeg",
    alt: "Terrasse extérieure et véranda du domaine",
    caption: "Terrasse extérieure",
  },
  {
    src: "/images/ceremonie/chambre 1.jpeg",
    alt: "Hébergement sur place au Domaine des Élégances",
    caption: "Hébergements sur place",
  },
  {
    src: "/images/ceremonie/sauna-interieur.jpeg",
    alt: "Espace sauna du Domaine des Élégances",
    caption: "Espaces de détente",
  },
];

export default async function CeremoniePage() {
  // Lecture du cookie (route dynamique, assumé) : une pub peut envoyer
  // directement ici — le popup de capture bloque tant que le visiteur
  // n'a pas laissé ses coordonnées.
  const cookieStore = await cookies();
  const hasContact = isValidContactId(
    cookieStore.get(CONTACT_ID_COOKIE)?.value,
  );

  return (
    <ThemeProvider
      theme="ceremonie"
      as="div"
      className="flex min-h-screen flex-col bg-surface"
    >
      <ContactGate initialOpen={!hasContact} sourcePage="/ceremonie" />
      <ViewContentTracker universe="ceremonie" contentName="Devis cérémonie" />
      <Header />

      <main className="flex-1">
        <Hero
          variant="ceremonie"
          eyebrow="Univers Cérémonie"
          title="Un domaine privé pour une cérémonie qui compte vraiment."
          subtitle="Mariage, baptême, communion, Bar Mitzvah : un cadre élégant, rassurant et privatisable pour réunir vos proches dans les meilleures conditions."
          primaryCta={{
            href: "#devis",
            label: "Préparer mon devis cérémonie",
            trackEvent: "ceremonie_start",
          }}
          microReassurance="Réponse sous 24h ouvrées - Proposition personnalisée - Sous réserve de disponibilité"
          image={{
            src: "/images/ceremonie/reception-barnum-nuit.jpeg",
            alt: "Domaine privé pour cérémonie familiale au Domaine des Élégances",
          }}
        />

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-10">
            <div>
              <Badge variant="accent" className="mb-6">
                Le domaine
              </Badge>
              <h2 className="font-serif text-3xl leading-tight md:text-[40px]">
                Un cadre élégant pour réunir les proches essentiels.
              </h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
              <p>
                Une cérémonie ne se résume pas à une salle. C'est une journée
                où chaque détail compte : l'arrivée des invités, les photos, le
                repas, les temps forts, les échanges en famille et la
                possibilité de prolonger le moment sur place.
              </p>
              <p>
                Le Domaine des Élégances permet de créer un cadre privé,
                lumineux et cohérent pour votre événement, avec des espaces
                intérieurs et extérieurs adaptés selon votre format.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface-alt py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="max-w-3xl">
              <Badge variant="accent" className="mb-6">
                Capacités & hébergements
              </Badge>
              <h2 className="font-serif text-3xl leading-tight md:text-[40px]">
                Des espaces pensés pour recevoir avec justesse.
              </h2>
              <p className="mt-8 text-base leading-relaxed text-ink-muted md:text-lg">
                Le domaine s'adapte à votre projet selon le format, le nombre
                d'invités et les besoins d'hébergement. Les capacités exactes
                sont confirmées avec l'équipe avant validation finale.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {capacityCards.map((item) => (
                <article
                  key={item.title}
                  className="flex min-h-[15rem] flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-surface-elevated p-7 shadow-soft md:p-8"
                >
                  <h3 className="font-serif text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-accent-strong">
                    {item.subtitle}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-muted md:text-base">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-start">
              <div className="max-w-3xl">
                <Badge variant="accent" className="mb-6">
                  Accompagnement
                </Badge>
                <h2 className="font-serif text-3xl leading-tight md:text-[40px]">
                  Vous partagez votre projet, nous clarifions la meilleure
                  configuration.
                </h2>
                <p className="mt-8 text-base leading-relaxed text-ink-muted md:text-lg">
                  Après votre demande, l'équipe reprend les informations
                  importantes : date, nombre d'invités, type de cérémonie,
                  hébergement, besoins familiaux et contraintes éventuelles.
                  L'objectif est de vous transmettre une première proposition
                  claire, puis de confirmer les détails avec vous.
                </p>
              </div>

              <div className="grid gap-4">
                {supportBlocks.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[var(--radius-lg)] border border-line bg-surface-elevated p-6 shadow-soft"
                  >
                    <h3 className="font-serif text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface-alt py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 max-w-3xl">
              <Badge variant="accent" className="mb-6">
                Galerie
              </Badge>
              <h2 className="font-serif text-3xl leading-tight md:text-[40px]">
                Le domaine en images
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
                Quelques vues du domaine pour vous projeter dans un format
                cérémonie, réception familiale ou week-end privatisé.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {galleryImages.map((image) => (
                <figure
                  key={image.src}
                  className={`group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-elevated shadow-soft ${
                    image.featured ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      image.featured ? "aspect-[16/10]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={
                        image.featured
                          ? "(min-width: 768px) 66vw, 100vw"
                          : "(min-width: 768px) 33vw, 100vw"
                      }
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 text-sm font-medium text-white">
                    {image.caption}
                  </figcaption>
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
              <h2 className="font-serif text-3xl leading-tight md:text-[40px]">
                Ressentez le cadre avant de vous décider
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
                Une immersion dans le domaine pour vous projeter dans votre
                cérémonie, au-delà des photos.
              </p>
            </div>

            <div className="overflow-hidden border border-line shadow-soft" style={{ aspectRatio: "16/9" }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/4u30fv4COk4"
                title="Aperçu du Domaine des Élégances — ambiance cérémonie"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="h-full w-full"
              />
            </div>
          </div>
        </section>

        <section
          id="devis"
          className="border-t border-line bg-surface py-20 md:py-28"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="mb-12 text-center">
              <Badge variant="accent" className="mb-6">
                Demande de devis cérémonie
              </Badge>
              <h2 className="font-serif text-3xl leading-tight md:text-[40px]">
                Préparez votre devis cérémonie
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                Indiquez-nous les premières informations de votre projet. Nous
                revenons vers vous avec une proposition adaptée à votre
                événement, à votre date et à votre configuration.
              </p>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-line bg-surface-elevated p-6 shadow-soft md:p-10">
              <LeadFormCeremonie />
            </div>
          </div>
        </section>
      </main>

      <Footer description="Un domaine privé pour mariages, cérémonies familiales, baptêmes, communions et Bar Mitzvah, avec hébergements sur place et accompagnement personnalisé." />
    </ThemeProvider>
  );
}
