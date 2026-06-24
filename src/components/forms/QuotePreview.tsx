"use client";

import { formatEur } from "@/lib/quote/formatQuote";
import type { QuoteResult } from "@/lib/quote/types";

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

export function QuotePreview({ quote }: { quote: QuoteResult | null }) {
  if (!quote) return null;

  const hasBase = quote.baseAmountMin > 0;
  const hasOptions = quote.calculatedOptions.length > 0;
  const hasWarnings = quote.warnings.length > 0;
  const surDevisItems = quote.manualReviewItems.filter(
    (i) => i.reason === "sur_devis",
  );
  const packIncludedItems = quote.manualReviewItems.filter((i) =>
    i.id.endsWith("_pack_included"),
  );

  if (!hasBase && !hasWarnings) return null;

  return (
    <div className="rounded-[var(--radius-md)] border border-accent/30 bg-surface-alt p-4 text-sm">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
        Estimation indicative
      </p>

      {hasBase && (
        <Row
          label="Base domaine"
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

      {surDevisItems.length > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
          <span className="font-medium">Sur devis partenaire :</span>{" "}
          {surDevisItems.map((i) => i.label).join(", ")}
        </p>
      )}

      {packIncludedItems.length > 0 && (
        <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
          <span className="font-medium">Inclus selon pack :</span>{" "}
          {packIncludedItems
            .map((i) => i.label.replace(" (potentiellement inclus dans le pack — à confirmer)", ""))
            .join(", ")}
          {" "}— à confirmer
        </p>
      )}

      {hasWarnings &&
        quote.warnings.map((w, i) => (
          <p key={i} className="mt-2 text-xs leading-relaxed text-accent-strong">
            ⚠ {w}
          </p>
        ))}

      <p className="mt-3 text-[10px] leading-relaxed text-ink-subtle">
        {quote.disclaimer}
      </p>
    </div>
  );
}
