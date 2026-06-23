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

export const optionCheckboxClass =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface-elevated px-3 py-2 text-sm text-ink transition-colors hover:border-accent";
export const checkboxInputClass = "size-4 shrink-0 accent-[var(--accent-strong)]";

/* ───────────────────────────────────────────────────────────────
   CardSelect — sélecteur unique style casino (remplace les <select>)
   ─────────────────────────────────────────────────────────────── */

const cardBase =
  "rounded-[var(--radius-md)] border-2 px-3 py-2.5 text-sm font-medium text-center transition-all duration-150 cursor-pointer select-none active:scale-[0.95]";
const cardActive =
  "border-accent bg-accent/[0.12] text-ink shadow-[0_0_22px_var(--card-glow)]";
const cardInactive =
  "border-line bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink hover:scale-[1.01]";

const colsClass: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export function CardSelect({
  options,
  value,
  onChange,
  cols = 2,
  getLabel,
}: {
  options: readonly string[];
  value: string | undefined;
  onChange: (v: string) => void;
  cols?: 2 | 3 | 4;
  getLabel?: (v: string) => string;
}) {
  return (
    <div className={cn("grid gap-2", colsClass[cols])}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(cardBase, value === opt ? cardActive : cardInactive)}
        >
          {getLabel ? getLabel(opt) : opt}
        </button>
      ))}
    </div>
  );
}

export function MultiCardSelect({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: readonly string[];
  value: string[] | undefined;
  onChange: (v: string[]) => void;
  cols?: 2 | 3 | 4;
}) {
  const selected = value ?? [];
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt],
    );
  return (
    <div className={cn("grid gap-2", colsClass[cols])}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(cardBase, selected.includes(opt) ? cardActive : cardInactive)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function PillSelect({
  options,
  value,
  onChange,
  getLabel,
}: {
  options: readonly string[];
  value: string | undefined;
  onChange: (v: string) => void;
  getLabel?: (v: string) => string;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 rounded-full border-2 px-2 py-1.5 text-[11px] font-bold text-center uppercase tracking-[0.06em]",
            "transition-all duration-150 cursor-pointer select-none active:scale-[0.95]",
            value === opt
              ? "border-accent bg-accent/[0.12] text-ink shadow-[0_0_12px_var(--card-glow)]"
              : "border-line bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink",
          )}
        >
          {getLabel ? getLabel(opt) : opt}
        </button>
      ))}
    </div>
  );
}

export const stepperBtnClass = cn(
  "flex size-11 shrink-0 items-center justify-center rounded-full",
  "border-2 border-line text-xl font-bold text-ink-muted",
  "transition-all duration-150 hover:border-accent hover:text-accent active:scale-90 select-none cursor-pointer",
);

/* ───────────────────────────────────────────────────────────────
   CalendarPicker — sélecteur de date custom style casino
   Grille mensuelle lun–dim, navigation mois, jour sélectionné en or.
   Output : chaîne "YYYY-MM-DD" compatible avec le champ event_date.
   ─────────────────────────────────────────────────────────────── */

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const calNavBtn = cn(
  "flex size-8 items-center justify-center rounded-full border-2 border-line",
  "text-lg text-ink-muted transition-all duration-150",
  "hover:border-accent hover:text-accent active:scale-90 cursor-pointer",
);

export function CalendarPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const initFrom = value ? new Date(value + "T00:00:00") : today;
  const [viewYear, setViewYear] = React.useState(initFrom.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initFrom.getMonth());
  const [view, setView] = React.useState<"days" | "months">("days");

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const firstDayOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: firstDayOffset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const handleDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return;
    onChange(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  };

  const selectMonth = (m: number) => {
    setViewMonth(m);
    setView("days");
  };

  return (
    <div className="select-none rounded-[var(--radius-md)] border-2 border-line bg-surface-elevated p-4">
      {/* Navigation header — flèches changent de sens selon la vue */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={view === "days" ? prevMonth : () => setViewYear((y) => y - 1)}
          className={calNavBtn}
          aria-label={view === "days" ? "Mois précédent" : "Année précédente"}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setView(view === "days" ? "months" : "days")}
          className="flex items-center gap-1 font-serif text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
          aria-label={view === "days" ? "Choisir le mois" : "Retour au calendrier"}
        >
          {view === "days" ? `${MONTH_NAMES[viewMonth]} ${viewYear}` : viewYear}
          <span className="text-[10px] text-ink-subtle">{view === "days" ? "˅" : "˄"}</span>
        </button>
        <button
          type="button"
          onClick={view === "days" ? nextMonth : () => setViewYear((y) => y + 1)}
          className={calNavBtn}
          aria-label={view === "days" ? "Mois suivant" : "Année suivante"}
        >
          ›
        </button>
      </div>

      {view === "months" ? (
        /* Vue sélection de mois — grille 4×3 */
        <div className="grid grid-cols-3 gap-2">
          {MONTH_NAMES.map((name, m) => (
            <button
              key={m}
              type="button"
              onClick={() => selectMonth(m)}
              className={cn(
                "rounded-[var(--radius-md)] border-2 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-150 cursor-pointer",
                m === viewMonth
                  ? "border-accent bg-accent/[0.12] text-ink shadow-[0_0_14px_var(--card-glow)]"
                  : "border-line bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink",
              )}
            >
              {name.slice(0, 3)}
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* En-têtes jours */}
          <div className="mb-1 grid grid-cols-7">
            {DAY_NAMES.map((d) => (
              <div key={d} className="py-1 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-ink-subtle">
                {d}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const thisDate = new Date(viewYear, viewMonth, day);
              const isPast = thisDate < today;
              const isSelected =
                !!selectedDate && thisDate.getTime() === selectedDate.getTime();
              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDay(day)}
                  className={cn(
                    "mx-auto flex size-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-150",
                    isSelected
                      ? "scale-105 bg-accent text-accent-foreground shadow-[0_0_14px_var(--card-glow)]"
                      : isPast
                        ? "cursor-not-allowed text-ink-subtle opacity-30"
                        : "cursor-pointer text-ink hover:bg-accent/20 active:scale-95",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Composant input pour react-phone-number-input — transparent, sans bordure propre
// (la bordure est portée par le conteneur PhoneInput via className)
export const PhoneInputInner = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className="min-w-0 flex-1 bg-transparent py-3 pl-3 pr-4 text-sm leading-relaxed text-ink outline-none placeholder:font-normal placeholder:text-ink-subtle disabled:cursor-not-allowed disabled:opacity-60"
  />
));
PhoneInputInner.displayName = "PhoneInputInner";
