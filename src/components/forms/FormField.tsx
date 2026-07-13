"use client";

import * as React from "react";
import Image from "next/image";
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
  gridClassName,
}: {
  options: readonly string[];
  value: string | undefined;
  onChange: (v: string) => void;
  cols?: 2 | 3 | 4;
  getLabel?: (v: string) => string;
  /** Remplace la grille par défaut (ex. "grid-cols-1 sm:grid-cols-3"). */
  gridClassName?: string;
}) {
  return (
    <div className={cn("grid gap-2", gridClassName ?? colsClass[cols])}>
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

type IconSet = "festif" | "ceremonie";
type EventIconName =
  | "arch"
  | "bow"
  | "cake"
  | "candle"
  | "cloche"
  | "cocktail"
  | "droplet"
  | "homeHeart"
  | "parasol"
  | "ring"
  | "ribbon"
  | "rings"
  | "shoe"
  | "star"
  | "table"
  | "users";
type IconComponent = (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;

function IconShell({
  children,
  ...props
}: React.PropsWithChildren<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

const eventIcons: Record<EventIconName, IconComponent> = {
  arch: (props) => (
    <IconShell {...props}>
      <path d="M12 40V22a12 12 0 0 1 24 0v18" />
      <path d="M18 40V22a6 6 0 0 1 12 0v18" />
      <path d="M9 40h30" />
      <path d="M15 14h18" />
    </IconShell>
  ),
  bow: (props) => (
    <IconShell {...props}>
      <path d="M21 19 8 13v22l13-6" />
      <path d="m27 19 13-6v22l-13-6" />
      <rect x="20" y="18" width="8" height="12" rx="2" />
      <path d="M20 22h8" />
      <path d="M20 26h8" />
    </IconShell>
  ),
  cake: (props) => (
    <IconShell {...props}>
      <path d="M13 24h22v16H13z" />
      <path d="M11 40h26" />
      <path d="M13 30c4 3 7 3 11 0s7-3 11 0" />
      <path d="M17 18v6M24 18v6M31 18v6" />
      <path d="M17 14c-2 2-2 4 0 5 2-1 2-3 0-5Z" />
      <path d="M24 14c-2 2-2 4 0 5 2-1 2-3 0-5Z" />
      <path d="M31 14c-2 2-2 4 0 5 2-1 2-3 0-5Z" />
    </IconShell>
  ),
  candle: (props) => (
    <IconShell {...props}>
      <path d="M24 8c-3 4-3 7 0 9 3-2 3-5 0-9Z" />
      <path d="M19 18h10v22H19z" />
      <path d="M15 40h18" />
      <path d="M24 18v22" />
      <path d="M18 26h12" />
    </IconShell>
  ),
  cloche: (props) => (
    <IconShell {...props}>
      <path d="M10 34h28" />
      <path d="M14 34a10 10 0 0 1 20 0" />
      <path d="M24 17v-4" />
      <path d="M20 13h8" />
      <path d="M8 39h32" />
    </IconShell>
  ),
  cocktail: (props) => (
    <IconShell {...props}>
      <path d="M13 12h22L24 25 13 12Z" />
      <path d="M24 25v14" />
      <path d="M17 39h14" />
      <path d="m29 12 6-5" />
      <circle cx="37" cy="6" r="2" />
    </IconShell>
  ),
  droplet: (props) => (
    <IconShell {...props}>
      <path d="M24 7s11 12 11 21a11 11 0 0 1-22 0C13 19 24 7 24 7Z" />
      <path d="M19 30a5 5 0 0 0 7 4" />
      <path d="M18 18h12" />
      <path d="M24 12v12" />
    </IconShell>
  ),
  homeHeart: (props) => (
    <IconShell {...props}>
      <path d="m9 24 15-13 15 13" />
      <path d="M14 22v18h20V22" />
      <path d="M24 35s-7-4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5-7 9-7 9Z" />
    </IconShell>
  ),
  parasol: (props) => (
    <IconShell {...props}>
      <path d="M8 23a16 16 0 0 1 32 0H8Z" />
      <path d="M12 23c3-7 7-10 12-10s9 3 12 10" />
      <path d="M24 23v17" />
      <path d="M24 40h9" />
      <path d="M10 37c5-3 9-3 14 0s9 3 14 0" />
    </IconShell>
  ),
  ring: (props) => (
    <IconShell {...props}>
      <path d="m20 13 4-5 4 5-4 5-4-5Z" />
      <circle cx="24" cy="29" r="11" />
      <path d="M18 21h12" />
    </IconShell>
  ),
  ribbon: (props) => (
    <IconShell {...props}>
      <path d="M24 23c-5-8-14-9-16-4-2 6 8 9 16 4Z" />
      <path d="M24 23c5-8 14-9 16-4 2 6-8 9-16 4Z" />
      <path d="M24 23v17" />
      <path d="m18 40 6-6 6 6" />
    </IconShell>
  ),
  rings: (props) => (
    <IconShell {...props}>
      <circle cx="19" cy="28" r="10" />
      <circle cx="29" cy="28" r="10" />
      <path d="m24 8 5 6-5 5-5-5 5-6Z" />
      <path d="M19 14h10" />
    </IconShell>
  ),
  shoe: (props) => (
    <IconShell {...props}>
      <path d="M14 10c6 6 10 13 13 22h10c2 0 3 1 3 3v4H11v-5c0-6 2-14 3-24Z" />
      <path d="M14 10h8" />
      <path d="M12 34h28" />
      <path d="M25 32c-2-4-5-7-9-9" />
    </IconShell>
  ),
  star: (props) => (
    <IconShell {...props}>
      <path d="m24 8 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1 5-11Z" />
    </IconShell>
  ),
  table: (props) => (
    <IconShell {...props}>
      <path d="M10 20h28" />
      <path d="M14 20v20" />
      <path d="M34 20v20" />
      <path d="M18 14h12a4 4 0 0 1 4 4v2H14v-2a4 4 0 0 1 4-4Z" />
      <path d="M8 31h32" />
      <path d="M18 31v9M30 31v9" />
    </IconShell>
  ),
  users: (props) => (
    <IconShell {...props}>
      <circle cx="24" cy="17" r="6" />
      <circle cx="13" cy="22" r="5" />
      <circle cx="35" cy="22" r="5" />
      <path d="M14 39v-3a10 10 0 0 1 20 0v3" />
      <path d="M4 38v-3a8 8 0 0 1 10-8" />
      <path d="M44 38v-3a8 8 0 0 0-10-8" />
    </IconShell>
  ),
};

const compactEventCardBase = cn(
  "group relative flex min-h-[104px] w-full min-w-0 flex-col items-center justify-center gap-1.5 overflow-hidden",
  "rounded-[var(--radius-md)] border-2 px-2 py-2.5 text-center",
  "transition-all duration-150 cursor-pointer select-none active:scale-[0.97]",
);
const compactEventCardActive =
  "border-accent bg-accent/[0.13] text-ink shadow-[0_0_18px_var(--card-glow)]";
const compactEventCardInactive =
  "border-line bg-surface-elevated text-ink-muted hover:border-accent/60 hover:text-ink hover:shadow-[0_0_12px_var(--card-glow)]";

function getFestifEventTone(option: string) {
  const normalized = normalizeEventOption(option);

  if (normalized.includes("evjf")) {
    return {
      cardActive:
        "border-[#ff2bd6] bg-[#ff2bd6]/20 text-white shadow-[0_0_28px_rgba(255,43,214,0.55)]",
      cardInactive:
        "border-[#ff2bd6]/70 bg-[#ff2bd6]/10 text-[#ffd9f8] hover:border-[#ff2bd6] hover:text-white hover:shadow-[0_0_24px_rgba(255,43,214,0.45)]",
      icon: "text-[#ff2bd6] drop-shadow-[0_0_8px_rgba(255,43,214,0.75)]",
      imageBorderActive:
        "border-[#ff2bd6] shadow-[0_0_16px_rgba(255,43,214,0.6)]",
      imageBorderInactive: "border-[#ff2bd6]/70",
      check: "border-[#ff2bd6] bg-[#ff2bd6] text-white",
      subtitle: "Enterrement de vie de jeune fille",
    };
  }

  if (normalized.includes("evg")) {
    return {
      cardActive:
        "border-[#00a3ff] bg-[#00a3ff]/20 text-white shadow-[0_0_28px_rgba(0,163,255,0.55)]",
      cardInactive:
        "border-[#00a3ff]/70 bg-[#00a3ff]/10 text-[#d7f2ff] hover:border-[#00a3ff] hover:text-white hover:shadow-[0_0_24px_rgba(0,163,255,0.45)]",
      icon: "text-[#00a3ff] drop-shadow-[0_0_8px_rgba(0,163,255,0.75)]",
      imageBorderActive:
        "border-[#00a3ff] shadow-[0_0_16px_rgba(0,163,255,0.6)]",
      imageBorderInactive: "border-[#00a3ff]/70",
      check: "border-[#00a3ff] bg-[#00a3ff] text-white",
      subtitle: "Enterrement de vie de garçon",
    };
  }

  return null;
}

const FESTIF_EVENT_IMAGES: Record<string, string> = {
  evjf: "/images/festif/icons/evjf.jpg",
  evg: "/images/festif/icons/evg.jpg",
  anniversaire: "/images/festif/icons/anniversaire.jpg",
};

function getFestifEventImage(option: string): string | null {
  const normalized = normalizeEventOption(option);

  if (normalized.includes("evjf")) return FESTIF_EVENT_IMAGES.evjf;
  if (normalized.includes("evg")) return FESTIF_EVENT_IMAGES.evg;
  if (normalized.includes("anniversaire")) return FESTIF_EVENT_IMAGES.anniversaire;
  return null;
}

function normalizeEventOption(option: string) {
  return option
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe");
}

function getEventIconName(option: string, iconSet: IconSet): EventIconName {
  const normalized = normalizeEventOption(option);

  if (iconSet === "festif") {
    if (normalized.includes("evjf")) return "shoe";
    if (normalized.includes("evg")) return "bow";
    if (normalized.includes("anniversaire")) return "cake";
    if (normalized.includes("soiree")) return "cocktail";
    if (normalized.includes("amis")) return "users";
    if (normalized.includes("pool") || normalized.includes("garden")) return "parasol";
    if (normalized.includes("reception")) return "cloche";
    if (normalized.includes("familiale")) return "homeHeart";
    return "star";
  }

  if (normalized.includes("mariage")) return "rings";
  if (normalized.includes("laique")) return "arch";
  if (normalized.includes("fiancailles")) return "ring";
  if (normalized.includes("renouvellement") || normalized.includes("voeux")) return "ribbon";
  if (normalized.includes("bapteme")) return "droplet";
  if (normalized.includes("communion")) return "candle";
  if (normalized.includes("bar mitzvah")) return "star";
  if (normalized.includes("familiale")) return "table";
  return "star";
}

export function IconCardSelect({
  options,
  value,
  onChange,
  iconSet,
}: {
  options: readonly string[];
  value: string | undefined;
  onChange: (v: string) => void;
  iconSet: IconSet;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const selected = value === opt;
        const Icon = eventIcons[getEventIconName(opt, iconSet)];
        const festifTone = iconSet === "festif" ? getFestifEventTone(opt) : null;
        const imageSrc = iconSet === "festif" ? getFestifEventImage(opt) : null;

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={selected}
            aria-label={festifTone ? `${opt} - ${festifTone.subtitle}` : opt}
            className={cn(
              compactEventCardBase,
              festifTone
                ? selected
                  ? festifTone.cardActive
                  : festifTone.cardInactive
                : selected
                  ? compactEventCardActive
                  : compactEventCardInactive,
            )}
          >
            <span
              className={cn(
                "absolute right-2 top-2 flex size-5 items-center justify-center rounded-full border text-[11px] font-bold leading-none",
                selected && festifTone
                  ? festifTone.check
                  : selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-line text-transparent",
              )}
              aria-hidden="true"
            >
              ✓
            </span>
            {imageSrc ? (
              <span
                className={cn(
                  "relative size-11 shrink-0 overflow-hidden rounded-full border-2 sm:size-12",
                  festifTone
                    ? selected
                      ? festifTone.imageBorderActive
                      : festifTone.imageBorderInactive
                    : selected
                      ? "border-accent shadow-[0_0_16px_var(--card-glow)]"
                      : "border-line",
                )}
              >
                <Image src={imageSrc} alt="" fill sizes="48px" className="object-cover" />
              </span>
            ) : (
              <Icon className={cn("size-7 sm:size-8", festifTone?.icon ?? "text-accent")} />
            )}
            <span className="max-w-full break-words text-[10px] font-semibold uppercase leading-snug text-current sm:text-[11px]">
              {opt}
            </span>
            {festifTone && (
              <span className="max-w-full break-words text-[9px] font-semibold leading-tight text-current/80 [overflow-wrap:anywhere] sm:text-[10px]">
                {festifTone.subtitle}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function MultiCardSelect({
  options,
  value,
  onChange,
  cols = 2,
  disabledOptions = [],
}: {
  options: readonly string[];
  value: string[] | undefined;
  onChange: (v: string[]) => void;
  cols?: 2 | 3 | 4;
  disabledOptions?: readonly string[];
}) {
  const selected = value ?? [];
  const toggle = (opt: string) => {
    if (disabledOptions.includes(opt)) return;
    onChange(
      selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt],
    );
  };
  return (
    <div className={cn("grid gap-2", colsClass[cols])}>
      {options.map((opt) => {
        const isDisabled = disabledOptions.includes(opt);
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            disabled={isDisabled}
            className={cn(
              cardBase,
              isDisabled
                ? "cursor-not-allowed border-line bg-surface-elevated opacity-50"
                : isSelected
                  ? cardActive
                  : cardInactive,
            )}
          >
            {isDisabled ? (
              <span className="flex flex-col items-center gap-0.5">
                <span>{opt}</span>
                <span className="text-[9px] uppercase tracking-wider text-accent-strong">
                  Inclus dans le pack
                </span>
              </span>
            ) : (
              opt
            )}
          </button>
        );
      })}
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

/* ───────────────────────────────────────────────────────────────
   RichCardSelect — sélecteur unique avec label et badge
   ─────────────────────────────────────────────────────────────── */

export type RichCardOption = {
  value: string;
  label: string;
  badge?: string;
};

export function RichCardSelect({
  options,
  value,
  onChange,
  cols = 1,
}: {
  options: RichCardOption[];
  value: string | undefined;
  onChange: (v: string) => void;
  /** 2 = deux colonnes à toutes les tailles d'écran. */
  cols?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-2", cols === 2 && "grid-cols-2")}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-wrap items-start justify-between gap-x-3 gap-y-1 rounded-[var(--radius-md)] border-2 px-3 py-3 text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.99]",
              selected
                ? "border-accent bg-accent/[0.12] text-ink shadow-[0_0_22px_var(--card-glow)]"
                : "border-line bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink hover:scale-[1.01]",
            )}
          >
            <span className="min-w-0 text-sm font-medium leading-snug text-ink">
              {opt.label}
            </span>
            {opt.badge && (
              <span
                className={cn(
                  "shrink-0 rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
                  selected
                    ? "bg-accent/20 text-accent-strong"
                    : "bg-surface-alt text-ink-subtle",
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   RichMultiCardSelect — sélecteur multiple avec label et badge
   ─────────────────────────────────────────────────────────────── */

export function RichMultiCardSelect({
  options,
  value,
  onChange,
  cols = 1,
}: {
  options: RichCardOption[];
  value: string[];
  onChange: (v: string[]) => void;
  /** 2 = deux colonnes à toutes les tailles d'écran. */
  cols?: 1 | 2;
}) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div className={cn("grid gap-2", cols === 2 && "grid-cols-2")}>
      {options.map((opt) => {
        const selected = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cn(
              "flex flex-wrap items-start justify-between gap-x-3 gap-y-1 rounded-[var(--radius-md)] border-2 px-3 py-3 text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.99]",
              selected
                ? "border-accent bg-accent/[0.12] text-ink shadow-[0_0_22px_var(--card-glow)]"
                : "border-line bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink hover:scale-[1.01]",
            )}
          >
            <span className="min-w-0 text-sm font-medium leading-snug text-ink">
              {opt.label}
            </span>
            {opt.badge && (
              <span
                className={cn(
                  "shrink-0 rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
                  selected
                    ? "bg-accent/20 text-accent-strong"
                    : "bg-surface-alt text-ink-subtle",
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
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

type CalendarPickerProps =
  | { multi?: false; value: string; onChange: (v: string) => void }
  | { multi: true; value: string[]; onChange: (v: string[]) => void };

export function CalendarPicker(props: CalendarPickerProps) {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const firstIso = props.multi ? props.value[0] : props.value;
  const initFrom = firstIso ? new Date(firstIso + "T00:00:00") : today;
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

  const toIso = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isDaySelected = (day: number): boolean => {
    const iso = toIso(day);
    return props.multi ? props.value.includes(iso) : props.value === iso;
  };

  const handleDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return;
    const iso = toIso(day);
    if (props.multi) {
      const current = props.value;
      props.onChange(
        current.includes(iso)
          ? current.filter((s) => s !== iso)
          : [...current, iso].sort(),
      );
    } else {
      props.onChange(iso);
    }
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
              const isSelected = isDaySelected(day);
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
