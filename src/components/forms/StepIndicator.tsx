"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const BASE_LABELS = [
  "Votre moment",
  "Votre date",
  "placeholder",
  "Votre projet",
] as const;

interface StepIndicatorProps {
  current: number;
  labels?: readonly string[];
  step3Label?: string;
}

export function StepIndicator({
  current,
  labels: customLabels,
  step3Label = "Votre réception",
}: StepIndicatorProps) {
  const labels = customLabels ?? [
    BASE_LABELS[0],
    BASE_LABELS[1],
    step3Label,
    BASE_LABELS[3],
  ];

  return (
    <div className="flex items-start" aria-label={`Étape ${current} sur ${labels.length}`}>
      {labels.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all",
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
                  "hidden text-center text-[9px] font-semibold uppercase tracking-[0.12em] sm:block",
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
            {i < labels.length - 1 && (
              <div
                className={cn(
                  "mx-1 mt-3.5 h-px flex-[2] transition-colors",
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
