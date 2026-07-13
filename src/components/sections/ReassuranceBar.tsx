import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ReassuranceBar — bande de réassurance horizontale (3-4 points).
 *
 * Pilotée par props, agnostique du thème. Typique de la home page
 * (« Réponse sous 24h », « Devis personnalisé », « Accompagnement
 * dédié »…).
 *
 * Chaque item = icône (Lucide) + titre + 1 ligne de description.
 */
export interface ReassuranceItem {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
}

export interface ReassuranceBarProps {
  items: ReassuranceItem[];
  className?: string;
}

export function ReassuranceBar({ items, className }: ReassuranceBarProps) {
  if (!items.length) return null;

  return (
    <section className={cn("border-y border-line bg-surface-alt", className)}>
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col items-start gap-3 text-left"
            >
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-accent/40 bg-accent/10 text-accent-strong"
                aria-hidden
              >
                <Icon className="size-5" />
              </span>
              <h4 className="font-serif text-base">
                {title}
              </h4>
              <p className="text-sm leading-relaxed text-ink-muted">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
