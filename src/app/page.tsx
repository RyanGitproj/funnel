import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { UniversCard } from "@/components/sections/UniversCard";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { Badge } from "@/components/ui/badge";
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
          subtitle="Mariage, cérémonie familiale, EVJF, EVG ou anniversaire : choisissez votre univers, nous préparons un parcours adapté à votre projet."
          primaryCta={{
            href: "#orientation",
            label: "CHOISIR MON UNIVERS",
          }}
          secondaryCta={{
            href: "#contact",
            label: "CONTACTER L'ÉQUIPE",
            variant: "outline",
          }}
          image={{
            src: "/images/ceremonie/parc-du-domaine.jpeg",
            alt: "Vue panoramique du Domaine des Élégances",
          }}
          accentImage={{
            src: "/images/ceremonie/reception-barnum-nuit.jpeg",
            alt: "Réception privée nocturne au Domaine des Élégances",
          }}
        />

        <section
          id="orientation"
          className="scroll-mt-24 border-y border-line bg-surface-alt py-20 md:scroll-mt-28 md:py-28"
        >
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
            <Badge variant="accent" className="mb-6">
              PARCOURS PERSONNALISÉ
            </Badge>
            <h2 className="mx-auto max-w-3xl font-serif text-3xl font-semibold leading-tight text-ink md:text-[40px]">
              Quel événement souhaitez-vous organiser&nbsp;?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
              Le Domaine des Élégances accueille deux types de projets : les
              moments solennels à vivre en famille, et les célébrations
              festives entre proches. Choisissez le parcours qui correspond à
              votre intention, puis recevez une première proposition adaptée.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:gap-10 lg:px-10">
            <UniversCard
              eyebrow="UNIVERS CÉRÉMONIE"
              title="Mariages & cérémonies familiales"
              description="Pour un mariage, une Bar Mitzvah, un baptême, une communion ou une réunion familiale élégante, le domaine offre un cadre privé, lumineux et rassurant, avec des espaces de réception et des couchages sur place pour les proches essentiels."
              href="/ceremonie"
              ctaLabel="PRÉPARER MON PROJET CÉRÉMONIE"
              image={{
                src: "/images/ceremonie/hero-bg.jpeg",
                alt: "Façade lumineuse du Domaine des Élégances",
              }}
            />
            <UniversCard
              eyebrow="UNIVERS FESTIF"
              title="EVJF, EVG & anniversaires"
              description="Pour un EVJF, un EVG, un anniversaire ou un week-end entre amis, le domaine permet de vivre une parenthèse privée, festive et confortable, avec espaces extérieurs, hébergements, activités et ambiance sur mesure."
              href="/festif"
              ctaLabel="DÉCOUVRIR LE PARCOURS FESTIF"
              image={{
                src: "/images/festif/barnum.jpg",
                alt: "Réception festive nocturne au Domaine des Élégances",
              }}
            />
          </div>
        </section>

        <ReassuranceBar items={reassuranceItems} />
      </main>

      <Footer description="Un domaine privé pour cérémonies, week-ends festifs et événements familiaux, avec deux parcours de demande adaptés à votre projet." />
    </ThemeProvider>
  );
}
