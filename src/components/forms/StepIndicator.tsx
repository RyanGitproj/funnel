"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Coordonnées", "Événement", "Projet"] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start" aria-label={`Étape ${current} sur 3`}>
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-bold transition-all",
                  done
                    ? "bg-accent text-accent-foreground"
                    : active
                      ? "bg-accent text-accent-foreground ring-2 ring-accent/30"
                      : "border-2 border-line text-ink-subtle",
                )}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={cn(
                  "text-center text-[10px] font-semibold uppercase tracking-[0.14em]",
                  active
                    ? "text-accent"
                    : done
                      ? "text-ink-muted"
                      : "text-ink-subtle",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "mx-1 mt-4 h-px flex-[2] transition-colors",
                  done ? "bg-accent" : "bg-line",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
