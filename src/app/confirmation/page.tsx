import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEur } from "@/lib/quote/formatQuote";
import {
  CONFIRMATION_QUOTE_COOKIE,
  parseConfirmationQuoteCookie,
  type ConfirmationQuoteSnapshot,
} from "@/lib/quote/confirmationQuote";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

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

function formatAmountRange(min: number, max: number) {
  if (min <= 0 && max <= 0) return "À définir";
  if (min === max) return formatEur(min);

  return `${formatEur(min)} – ${formatEur(max)}`;
}

function formatOptionFormula(
  option: ConfirmationQuoteSnapshot["calculatedOptions"][number],
) {
  const unitPriceMin = option.unitPriceMin ?? option.totalMin / option.quantity;
  const unitPriceMax = option.unitPriceMax ?? option.totalMax / option.quantity;
  const unitLabel = formatAmountRange(unitPriceMin, unitPriceMax);

  if (option.quantity <= 1) return `Prix unitaire : ${unitLabel}`;

  return `Calcul : ${unitLabel} x ${option.quantity}`;
}

function QuoteSummary({ quote }: { quote: ConfirmationQuoteSnapshot }) {
  const hasBase = quote.baseAmountMin > 0 || quote.baseAmountMax > 0;
  const hasOptions = quote.calculatedOptions.length > 0;
  const hasManualItems = quote.manualReviewItems.length > 0;
  const hasWarnings = quote.warnings.length > 0;

  return (
    <section className="mt-14 border border-line bg-surface-elevated shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-line bg-surface-alt p-7 md:p-9 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 text-accent-strong">
              <Calculator className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-eyebrow">Dernier devis généré</p>
              <p className="mt-1 text-sm text-ink-muted">
                {quote.universeLabel}
              </p>
            </div>
          </div>

          <div className="mt-9">
            <p className="text-sm font-medium text-ink-muted">
              Total estimatif
            </p>
            <p className="mt-3 font-serif text-4xl font-semibold leading-none text-ink md:text-5xl">
              {quote.displayLabel}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">
              {quote.disclaimer}
            </p>
          </div>
        </div>

        <div className="p-7 md:p-9">
          <div className="space-y-4">
            {hasBase && (
              <div className="flex items-start justify-between gap-5 border-b border-line pb-4">
                <div>
                  <p className="font-serif text-lg font-medium text-ink">
                    {quote.pricingModeLabel}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-subtle">
                    Base de calcul
                  </p>
                </div>
                <p className="shrink-0 text-right font-serif text-lg font-medium tabular-nums text-ink">
                  {formatAmountRange(quote.baseAmountMin, quote.baseAmountMax)}
                </p>
              </div>
            )}

            {hasOptions &&
              quote.calculatedOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-start justify-between gap-5 border-b border-line pb-4"
                >
                  <div>
                    <p className="font-medium text-ink">{option.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-subtle">
                      {formatOptionFormula(option)}
                    </p>
                  </div>
                  <p className="shrink-0 text-right tabular-nums text-ink-muted">
                    + {formatAmountRange(option.totalMin, option.totalMax)}
                  </p>
                </div>
              ))}
          </div>

          {!hasBase && !hasOptions && (
            <p className="text-sm leading-relaxed text-ink-muted">
              Votre demande nécessite une validation humaine avant estimation
              chiffrée. L'équipe reprend les détails avant de vous répondre.
            </p>
          )}

          {(hasManualItems || hasWarnings) && (
            <div className="mt-6 border border-accent/30 bg-accent/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                À confirmer avec l'équipe
              </p>

              {hasManualItems && (
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-muted">
                  {quote.manualReviewItems.map((item) => (
                    <li key={item.id} className="flex gap-2">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-accent-strong"
                        aria-hidden
                      />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              )}

              {hasWarnings && (
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-ink-muted">
                  {quote.warnings.map((warning) => (
                    <p key={warning}>{warning}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function ConfirmationPage() {
  const cookieStore = await cookies();
  const quote = parseConfirmationQuoteCookie(
    cookieStore.get(CONFIRMATION_QUOTE_COOKIE)?.value,
  );
  const theme = quote?.universe === "festif" ? "festif" : "ceremonie";
  const returnPath = quote?.returnPath ?? "/";
  const returnLabel = quote?.returnLabel ?? "Retourner à l'accueil";

  return (
    <ThemeProvider
      theme={theme}
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

            {quote && <QuoteSummary quote={quote} />}

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
              <Button asChild size="lg" variant="primary">
                <Link href={returnPath}>
                  {returnLabel}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </ThemeProvider>
  );
}
