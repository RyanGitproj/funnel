"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * FormField — wrapper réutilisable (label + control + error + hint).
 *
 * Agnostique du thème : tous les styles passent par les tokens
 * sémantiques. Le rendu bascule automatiquement entre clair (Cérémonie)
 * et sombre (Festif) via le data-theme ambiant.
 *
 * On ne dépend PAS du wrapper Form de shadcn (qui amène beaucoup de
 * gymnastique with useController) pour rester léger : on accepte
 * simplement les props `id`, `label`, `error`, `hint`, `required` et
 * on rend l'input/select/textarea passé en `children`. L'appelant
 * relie lui-même le field à React Hook Form via register / Controller.
 *
 * Accessibilité :
 *   - `htmlFor`/`id` lient le label au champ
 *   - `aria-invalid` posé sur le wrapper, `aria-describedby` vers le
 *     message d'erreur quand présent
 */

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted"
      >
        {label}
        {required && (
          <span className="ml-1 text-accent-strong" aria-hidden>
            *
          </span>
        )}
      </label>

      {/* On injecte aria-invalid sur le champ via cloneElement pour
          rester générique (input, select, textarea). */}
      {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required ? true : undefined,
      })}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-ink-subtle">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs leading-relaxed text-accent-strong"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   Styles partagés des champs (input / select / textarea).
   Pas de composant dédié pour rester flexible avec RHF register().
   ─────────────────────────────────────────────────────────────── */

export const fieldBaseClass = cn(
  "w-full bg-surface-elevated text-ink",
  "border border-line",
  "rounded-[var(--radius-md)]",
  "px-4 py-3 text-sm leading-relaxed",
  "placeholder:text-ink-subtle placeholder:font-normal",
  "transition-[border-color,box-shadow] duration-200",
  "focus:outline-none focus:border-accent-strong focus:ring-2 focus:ring-accent/40",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "aria-[invalid=true]:border-accent-strong aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-accent-strong/30",
);

export const fieldSelectClass = cn(fieldBaseClass, "appearance-none pr-10 cursor-pointer");
