import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneLink, EmailLink } from "@/components/tracking/ContactLinks";
import { LeadConversionTracker } from "@/components/tracking/LeadConversionTracker";
import { formatEur } from "@/lib/quote/formatQuote";
import {
  CONFIRMATION_QUOTE_COOKIE,
  parseConfirmationQuoteCookie,
  type ConfirmationQuoteSnapshot,
} from "@/lib/quote/confirmationQuote";
import { getInclusDomaine } from "@/config/festif-inclus";
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

const NEXT_STEPS = [
  {
    titre: "Prise de contact sous 24-48h",
    detail: "Un interlocuteur dédié vous contacte par e-mail ou téléphone.",
  },
  {
    titre: "Visite du domaine (recommandée)",
    detail: "Découvrez les espaces et affinez votre projet avec nous.",
  },
  {
    titre: "Devis personnalisé",
    detail: "Une proposition détaillée et transparente, sans engagement.",
  },
];

function QuoteSummary({ quote }: { quote: ConfirmationQuoteSnapshot }) {
  const hasBase = quote.baseAmountMin > 0 || quote.baseAmountMax > 0;
  const hasOptions = quote.calculatedOptions.length > 0;
  const hasInterests = quote.interestItems.length > 0;
  const hasManualItems = quote.manualReviewItems.length > 0;
  const hasWarnings = quote.warnings.length > 0;
  const isFestif = quote.universe === "festif";
  const domainItems = quote.includedItems.filter(
    (item) => item.category === "included_domain",
  );

  return (
    <section className="border border-line bg-surface-elevated shadow-soft">
      <div className="border-b border-line bg-surface-alt px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 text-accent-strong">
              <Calculator className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-eyebrow">Dernier devis généré</p>
              <p className="text-xs text-ink-muted">{quote.universeLabel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-ink-muted">
              Total estimatif
            </p>
            <p className="mt-0.5 font-serif text-2xl font-semibold leading-none text-ink md:text-3xl">
              {quote.displayLabel}
            </p>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          {quote.disclaimer}
        </p>
      </div>

      <div className="p-5 md:p-6">
        <div className="space-y-2.5">
          {hasBase && (
            <div className="flex items-start justify-between gap-4 border-b border-line pb-2.5">
              <div>
                <p className="text-sm font-medium text-ink">
                  {quote.pricingModeLabel}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
                  Base de calcul
                </p>
              </div>
              <p className="shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                {formatAmountRange(quote.baseAmountMin, quote.baseAmountMax)}
              </p>
            </div>
          )}

          {hasOptions &&
            quote.calculatedOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start justify-between gap-4 border-b border-line pb-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{option.label}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
                    {formatOptionFormula(option)}
                  </p>
                </div>
                <p className="shrink-0 text-right text-sm tabular-nums text-ink-muted">
                  + {formatAmountRange(option.totalMin, option.totalMax)}
                </p>
              </div>
            ))}

          {quote.cadeauChoiceLabel && (
            <div className="flex items-start justify-between gap-4 border-b border-line pb-2.5">
              <div>
                <p className="text-sm font-medium text-ink">Cadeau débloqué</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
                  Confirmé après réservation validée et acompte reçu
                </p>
              </div>
              <p className="shrink-0 text-right text-xs text-ink-muted">
                {quote.cadeauChoiceLabel}
              </p>
            </div>
          )}
        </div>

        {!hasBase && !hasOptions && (
          <p className="text-sm leading-relaxed text-ink-muted">
            Votre demande nécessite une validation humaine avant estimation
            chiffrée. L&apos;équipe reprend les détails avant de vous répondre.
          </p>
        )}

        {hasInterests && (
          <div className="mt-3 border border-line bg-surface-alt/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              Intérêts partenaires non additionnés
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              {quote.interestItems
                .map((item) =>
                  item.indicativePrice
                    ? `${item.label} (${item.indicativePrice})`
                    : item.label,
                )
                .join(", ")}
            </p>
          </div>
        )}

        {(hasManualItems || hasWarnings) && (
          <div className="mt-3 border border-accent/30 bg-accent/10 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
              À confirmer avec l&apos;équipe
            </p>

            {hasManualItems && (
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-ink-muted">
                {quote.manualReviewItems.map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 size-3.5 shrink-0 text-accent-strong"
                      aria-hidden
                    />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            )}

            {hasWarnings && (
              <div className="mt-2 space-y-1 text-xs leading-relaxed text-ink-muted">
                {quote.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {isFestif ? (
          <>
            <div className="mt-3 border border-line/60 bg-surface-alt/40 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                Inclus dans votre privatisation
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {getInclusDomaine(quote.festifDuration).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-1.5 text-xs leading-relaxed text-ink-muted"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-3 shrink-0 text-accent-strong"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {quote.guestCount !== undefined && quote.guestCount > 22 && (
              <div className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
                <CheckCircle2
                  className="mt-0.5 size-3.5 shrink-0 text-accent-strong"
                  aria-hidden
                />
                <p>
                  22 couchages intérieurs + {quote.guestCount - 22} place
                  {quote.guestCount - 22 > 1 ? "s" : ""} bivouac. Au-delà de 22
                  personnes, des places bivouac peuvent être ajoutées en tentes
                  4 personnes, avec matelas gonflable et duvet fournis.
                </p>
              </div>
            )}
            {quote.guestCount !== undefined && quote.guestCount <= 22 && (
              <div className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
                <CheckCircle2
                  className="mt-0.5 size-3.5 shrink-0 text-accent-strong"
                  aria-hidden
                />
                <p>
                  22 couchages intérieurs maximum, lits doubles et lits simples
                  confondus.
                </p>
              </div>
            )}
          </>
        ) : (
          domainItems.length > 0 && (
            <div className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
              <CheckCircle2
                className="mt-0.5 size-3.5 shrink-0 text-accent-strong"
                aria-hidden
              />
              <p>
                <span className="font-medium text-ink">
                  Votre séjour inclut l&apos;accès privatif :
                </span>{" "}
                {domainItems.map((i) => i.label).join(", ")}.
              </p>
            </div>
          )
        )}
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
        <section className="py-6 md:py-8">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div
              className={cn(
                quote
                  ? "grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start"
                  : "mx-auto max-w-2xl",
              )}
            >
              <div className="min-w-0 text-center lg:col-start-1 lg:row-start-1 lg:text-left">
                <Badge variant="accent" className="mb-4">
                  Demande reçue
                </Badge>
                <h1 className="font-serif text-2xl font-semibold leading-[1.12] text-ink md:text-4xl">
                  Merci — nous avons bien reçu votre demande.
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                  Chaque demande est lue personnellement par notre équipe.
                  Premier retour sous 24 à 48h ouvrées, avec une proposition
                  d&apos;échange : visite du domaine, appel de cadrage ou
                  premier devis.
                </p>
              </div>

              {quote && (
                <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                  <QuoteSummary quote={quote} />
                  <LeadConversionTracker universe={quote.universe} />
                </div>
              )}

              <div className="min-w-0 lg:col-start-1 lg:row-start-2">
                {/* Prochaines étapes */}
                <div className="border-t border-line pt-5 text-left">
                  <h2 className="text-eyebrow mb-4">Prochaines étapes</h2>
                  <ol className="space-y-3">
                    {NEXT_STEPS.map((step, index) => (
                      <li key={step.titre} className="flex gap-3">
                        <span
                          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent-strong bg-accent/10 font-serif text-xs font-semibold text-accent-strong"
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-serif text-base font-medium leading-snug text-ink">
                            {step.titre}
                          </h3>
                          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
                    Réservation de créneau de visite en ligne bientôt
                    disponible — en attendant, nous vous contactons
                    directement.
                  </p>
                </div>

                {/* Coordonnées directes */}
                <div className="mt-6 border-t border-line pt-5 text-left">
                  <h2 className="text-eyebrow mb-4">
                    Une question immédiate&nbsp;?
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <PhoneLink className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-surface-elevated p-3 transition-colors hover:border-accent-strong">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 text-accent-strong">
                        <Phone className="size-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                          Téléphone
                        </p>
                        <p className="font-serif text-base text-ink">
                          07 88 80 81 94
                        </p>
                      </div>
                    </PhoneLink>
                    <EmailLink className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-surface-elevated p-3 transition-colors hover:border-accent-strong">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 text-accent-strong">
                        <Mail className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                          E-mail
                        </p>
                        <p className="truncate font-serif text-sm text-ink">
                          contact@domainedeselegances.fr
                        </p>
                      </div>
                    </EmailLink>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
                    <Clock className="size-3.5" aria-hidden />
                    <span>Réponse sous 24h ouvrées · Lun–Sam, 9h–19h</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    asChild
                    size="lg"
                    variant="primary"
                    className="h-auto min-h-12 w-full whitespace-normal sm:w-auto"
                  >
                    <Link href={returnPath}>
                      {returnLabel}
                      <ArrowRight className="size-4 shrink-0" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </ThemeProvider>
  );
}
