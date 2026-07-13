"use client";

import { formatEur } from "@/lib/quote/formatQuote";
import type { QuoteResult } from "@/lib/quote/types";
import { getInclusDomaine } from "@/config/festif-inclus";

function Row({
  label,
  min,
  max,
  prefix = "",
  muted = false,
}: {
  label: string;
  min: number;
  max: number;
  prefix?: string;
  muted?: boolean;
}) {
  const value =
    min === max
      ? `${prefix}${formatEur(min)}`
      : `${prefix}${formatEur(min)} – ${formatEur(max)}`;

  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className={muted ? "text-ink-subtle" : "text-ink-muted"}>{label}</span>
      <span
        className={`shrink-0 text-right tabular-nums ${muted ? "text-ink-subtle" : "text-ink-muted"}`}
      >
        {value}
      </span>
    </div>
  );
}

export function QuotePreview({
  quote,
  guestCount,
  compact = false,
}: {
  quote: QuoteResult | null;
  guestCount?: number;
  /**
   * Mode résumé pour l'étape finale (formulaire court) : total, prix
   * par personne, alertes et disclaimer seulement — le détail complet
   * est affiché à l'étape options et sur /confirmation.
   */
  compact?: boolean;
}) {
  if (!quote) return null;

  const hasBase = quote.baseAmountMin > 0;
  const hasOptions = quote.calculatedOptions.length > 0;
  const hasInterests = quote.interestItems.length > 0;
  const hasWarnings = quote.warnings.length > 0;
  const surDevisItems = quote.manualReviewItems.filter(
    (i) => i.reason === "sur_devis",
  );
  const domainItems = quote.includedItems.filter(
    (i) => i.category === "included_domain",
  );
  const isFestif = quote.universe === "festif";
  const gc = guestCount ?? quote.guestCount;

  if (!hasBase && !hasInterests && !hasWarnings) return null;

  if (compact) {
    return (
      <div className="rounded-[var(--radius-md)] border border-accent/30 bg-surface-alt p-3 text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-serif font-medium text-ink">
            Estimation indicative
          </span>
          <span className="shrink-0 text-right font-serif font-medium tabular-nums text-ink">
            {quote.displayLabel}
          </span>
        </div>

        {isFestif && quote.pricingMode === "grid" && quote.estimatedMin > 0 && gc && (
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Soit environ{" "}
            <strong>{Math.round(quote.estimatedMin / gc)} €/personne</strong>{" "}
            (options incluses).
          </p>
        )}

        {hasWarnings &&
          quote.warnings.map((w, i) => (
            <p key={i} className="mt-1.5 text-xs leading-relaxed text-accent-strong">
              ⚠ {w}
            </p>
          ))}

        <p className="mt-1.5 text-[10px] leading-relaxed text-ink-subtle">
          {quote.disclaimer}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-accent/30 bg-surface-alt p-4 text-sm">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
        Estimation indicative
      </p>

      {hasBase && (
        <Row
          label={
            quote.pricingMode === "grid"
              ? "Séjour estimé"
              : quote.pricingMode === "pending"
              ? "Estimation à confirmer"
              : "Base domaine"
          }
          min={quote.baseAmountMin}
          max={quote.baseAmountMax}
        />
      )}

      {hasOptions &&
        quote.calculatedOptions.map((opt) => (
          <Row
            key={opt.id}
            label={
              opt.quantity > 1
                ? `${opt.label} × ${opt.quantity}`
                : opt.label
            }
            min={opt.totalMin}
            max={opt.totalMax}
            prefix="+ "
          />
        ))}

      {hasBase && (
        <div className="mt-3 border-t border-line pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-serif font-medium text-ink">
              Total estimatif
            </span>
            <span className="shrink-0 text-right font-serif font-medium tabular-nums text-ink">
              {quote.displayLabel}
            </span>
          </div>
        </div>
      )}

      {/* Prix par personne — festif uniquement */}
      {isFestif && quote.pricingMode === "grid" && quote.estimatedMin > 0 && gc && (
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          Soit environ{" "}
          <strong>{Math.round(quote.estimatedMin / gc)} €/personne</strong>{" "}
          (options incluses).
        </p>
      )}

      {/* Message bivouac */}
      {isFestif && gc !== undefined && gc <= 22 && (
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          22 couchages intérieurs maximum, lits doubles et lits simples confondus.
        </p>
      )}

      {isFestif && gc !== undefined && gc > 22 && (
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          22 couchages intérieurs + {gc - 22} place{gc - 22 > 1 ? "s" : ""} bivouac.
          Au-delà de 22 personnes, des places bivouac peuvent être ajoutées en tentes
          4 personnes, avec matelas gonflable et duvet fournis.
        </p>
      )}

      {surDevisItems.length > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
          <span className="font-medium">Sur devis partenaire :</span>{" "}
          {surDevisItems.map((i) => i.label).join(", ")}
        </p>
      )}

      {isFestif && quote.cadeauChoiceLabel && (
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          <span className="font-medium">Cadeau débloqué :</span>{" "}
          {quote.cadeauChoiceLabel}
        </p>
      )}

      {hasInterests && (
        <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
          <span className="font-medium">
            Intérêts partenaires non additionnés :
          </span>{" "}
          {quote.interestItems
            .map((item) =>
              item.indicativePrice
                ? `${item.label} (${item.indicativePrice})`
                : item.label,
            )
            .join(", ")}
        </p>
      )}

      {hasWarnings &&
        quote.warnings.map((w, i) => (
          <p key={i} className="mt-2 text-xs leading-relaxed text-accent-strong">
            ⚠ {w}
          </p>
        ))}

      {/* Bloc inclus — festif uniquement */}
      {isFestif && (
        <div className="mt-3 border-t border-line/60 pt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Inclus dans votre privatisation
          </p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {getInclusDomaine(quote.festifDuration).map((item) => (
              <li key={item} className="text-[10px] leading-relaxed text-ink-subtle">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {domainItems.length > 0 && !isFestif && (
        <p className="mt-3 border-t border-line/60 pt-3 text-[10px] leading-relaxed text-ink-subtle">
          <span className="font-medium">Accès privatif inclus :</span>{" "}
          {domainItems.map((i) => i.label).join(", ")}.
        </p>
      )}

      {/* Phrase de valeur — festif uniquement */}
      {isFestif && hasBase && (
        <p className="mt-3 text-[10px] leading-relaxed text-ink-subtle">
          Votre estimation ne comprend pas seulement un hébergement. Elle comprend la
          privatisation d&apos;un Domaine complet — avec ses espaces, ses équipements, son
          cadre privé et les options que vous avez choisies.
        </p>
      )}

      <p className="mt-2 text-[10px] leading-relaxed text-ink-subtle">
        {quote.disclaimer}
      </p>
    </div>
  );
}
