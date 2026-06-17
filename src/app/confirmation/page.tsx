import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Confirmation — Nous avons bien reçu votre demande",
  description:
    "Votre demande de devis a bien été envoyée au Domaine des Élégances. Notre équipe vous recontacte sous 24 à 48h ouvrées.",
  alternates: { canonical: "/confirmation" },
  openGraph: {
    title: "Confirmation — Domaine des Élégances",
    description:
      "Votre demande de devis a bien été envoyée. Notre équipe vous recontacte sous 24 à 48h.",
    url: "/confirmation",
    type: "website",
  },
  // Page de confirmation transitoire : on évite qu'elle soit indexée
  // comme une page sémantique autonome.
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <ThemeProvider
      theme="accueil"
      as="div"
      className="flex min-h-screen flex-col bg-surface"
    >
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <div className="text-center">
              <Badge variant="accent" className="mb-6">
                Demande reçue
              </Badge>
              <h1 className="font-serif text-4xl font-semibold leading-[1.12] text-ink md:text-[56px]">
                Merci — nous avons bien reçu votre demande.
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
                Chaque demande est lue personnellement par notre équipe. Vous
                recevrez un premier retour sous 24 à 48h ouvrées, avec une
                proposition d'échange — visite du domaine, appel de
                cadrage, ou premier devis selon votre préférence.
              </p>
            </div>

            {/* Prochaines étapes */}
            <div className="mt-16 border-t border-line pt-12">
              <h2 className="text-eyebrow mb-8">Prochaines étapes</h2>
              <ol className="space-y-6">
                {[
                  {
                    titre: "Prise de contact sous 24-48h",
                    detail:
                      "Un interlocuteur dédié vous contacte par e-mail ou téléphone, selon votre préférence.",
                  },
                  {
                    titre: "Visite du domaine (recommandée)",
                    detail:
                      "Nous vous accueillons pour découvrir les espaces et affiner ensemble votre projet.",
                  },
                  {
                    titre: "Devis personnalisé",
                    detail:
                      "Vous recevez une proposition détaillée et transparente, sans engagement.",
                  },
                ].map((step, index) => (
                  <li key={step.titre} className="flex gap-6">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-strong bg-accent/10 font-serif text-sm font-semibold text-accent-strong"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-ink">
                        {step.titre}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Bloc Calendly — réservé, à intégrer ultérieurement */}
            {/*
              <div className="mt-16 border border-line bg-surface-alt p-8 rounded-[var(--radius-lg)]">
                <h2 className="font-serif text-xl font-medium text-ink">
                  Réserver un créneau de visite
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Choisissez directement un créneau dans notre agenda.
                </p>
                <Calendly inline url="https://calendly.com/domainedeselegances/visite" />
              </div>
            */}

            <div className="mt-16 border border-dashed border-line bg-surface-alt/60 p-8 rounded-[var(--radius-lg)] text-center">
              <p className="text-eyebrow mb-2">Bientôt disponible</p>
              <p className="text-sm leading-relaxed text-ink-muted">
                Un outil de réservation de créneau de visite sera intégré
                ici prochainement. En attendant, nous vous contactons
                directement pour convenir d'un rendez-vous.
              </p>
            </div>

            {/* Coordonnées directes */}
            <div className="mt-16 border-t border-line pt-12">
              <h2 className="text-eyebrow mb-8">Une question immédiate&nbsp;?</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <a
                  href="tel:+33000000000"
                  className="group flex items-start gap-4 border border-line bg-surface-elevated p-6 rounded-[var(--radius-lg)] transition-colors hover:border-accent-strong"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 text-accent-strong">
                    <Phone className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                      Téléphone
                    </p>
                    <p className="mt-1 font-serif text-lg text-ink">
                      +33 (0)0 00 00 00 00
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:contact@domainedeselegances.fr"
                  className="group flex items-start gap-4 border border-line bg-surface-elevated p-6 rounded-[var(--radius-lg)] transition-colors hover:border-accent-strong"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 text-accent-strong">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                      E-mail
                    </p>
                    <p className="mt-1 font-serif text-lg text-ink">
                      contact@domainedeselegances.fr
                    </p>
                  </div>
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 text-sm text-ink-muted">
                <Clock className="size-4" aria-hidden />
                <span>Réponse sous 24h ouvrées · Lun–Sam, 9h–19h</span>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </ThemeProvider>
  );
}
