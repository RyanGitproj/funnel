"use client";

import * as React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  budgetRangeOptions,
  dateFlexibilityLabels,
  dateFlexibilityOptions,
  festifAmbianceOptions,
  festifActivitesInterestOptions,
  festifEventTypeOptions,
  festifLeadSchema,
  festifPackLabels,
  festifPackOptions,
  festifSelectedOptions,
  projectStageOptions,
  type FestifLeadInput,
} from "@/lib/validations/lead-schema";
import {
  FESTIF_ACTIVITY_OPTIONS,
  getFestifPackIncludedLabels,
} from "@/config/pricing/festif";
import { submitFestifLead } from "@/actions/leads";
import {
  FormField,
  fieldBaseClass,
  checkboxInputClass,
  PhoneInputInner,
  CardSelect,
  IconCardSelect,
  MultiCardSelect,
  PillSelect,
  CalendarPicker,
  stepperBtnClass,
} from "./FormField";
import { StepIndicator } from "./StepIndicator";
import { Button } from "@/components/ui/button";
import { QuotePreview } from "./QuotePreview";
import { computeFestifQuote } from "@/lib/quote/quoteCalculator";

const FORM_ID = "lead-form-festif";

const ACTIVITY_ICONS: Record<string, React.ReactElement> = {
  "Combat de sumo": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
      <line x1="13" y1="19" x2="19" y2="13"/>
      <line x1="16" y1="16" x2="20" y2="20"/>
      <line x1="19" y1="21" x2="21" y2="19"/>
    </svg>
  ),
  "Chasse au trésor": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <path d="M9 20l-6-3V5l6 3 6-3 6 3v12l-6-3-6 3z"/>
      <line x1="9" y1="8" x2="9" y2="20"/>
      <line x1="15" y1="5" x2="15" y2="17"/>
    </svg>
  ),
  "Escape game apéro": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <rect x="5" y="11" width="14" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  "Parcours d'énigmes": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  "Parcours gages & défis": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  ),
  "Table de casino": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/>
    </svg>
  ),
  "Cocooning love": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  "Magicien / mentaliste": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
    </svg>
  ),
  "Échassiers / cracheurs de feu": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c.93 0 1.77-.5 2.24-1.25"/>
      <path d="M12 22C6.5 22 2 17.5 2 12c0-4 2.5-7.5 6-9.5 0 3 1.5 5.5 3 7 .5-1 1-2 1-3.5 1.5 2 2 4 2 6.5 1.5-1 2-2.5 2-4.5 2 2 3 5 3 7.5 0 5.5-4.5 6.5-7 6.5z"/>
    </svg>
  ),
  "Activités extérieures": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
};

const STEP_FIELDS: (keyof FestifLeadInput)[][] = [
  ["event_type", "guest_count"],
  ["event_date", "event_end_date", "date_flexibility"],
  [],
  ["budget_range", "project_stage"],
  ["first_name", "last_name", "email", "phone", "rgpd_consent"],
];

function SectionQuestion({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="font-serif text-base font-medium leading-snug text-ink">
      {children}
      {required && (
        <span className="ml-1 text-accent-strong" aria-hidden>
          *
        </span>
      )}
    </p>
  );
}

export function LeadFormFestif() {
  const [step, setStep] = React.useState(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [activitesToggle, setActivitesToggle] = React.useState<"oui" | "non" | undefined>(undefined);
  const [validationAttempt, setValidationAttempt] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors },
  } = useForm<FestifLeadInput>({
    resolver: zodResolver(festifLeadSchema),
    defaultValues: {
      funnel_type: "festif",
      source_page: "/festif",
      event_type: undefined,
      event_date: "",
      event_end_date: "",
      date_flexibility: undefined,
      guest_count: undefined,
      selected_options: [],
      activites_interest: [],
      ambiance: undefined,
      festif_pack: undefined,
      budget_range: undefined,
      project_stage: undefined,
      message: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      rgpd_consent: false,
      marketing_optin: false,
    },
  });

  const phoneValue = useWatch({ control, name: "phone", defaultValue: "" });
  const guestCount = useWatch({ control, name: "guest_count" });
  const selectedOptions = useWatch({ control, name: "selected_options", defaultValue: [] });
  const activitesInterest = useWatch({ control, name: "activites_interest", defaultValue: [] });
  const festifPack = useWatch({ control, name: "festif_pack" });

  const packIncludedLabels = React.useMemo(() => {
    return getFestifPackIncludedLabels(festifPack);
  }, [festifPack]);

  React.useEffect(() => {
    if (packIncludedLabels.length === 0 || !selectedOptions?.length) return;

    const nextOptions = selectedOptions.filter(
      (option) => !packIncludedLabels.includes(option),
    );

    if (nextOptions.length !== selectedOptions.length) {
      setValue("selected_options", nextOptions, { shouldValidate: true });
    }
  }, [packIncludedLabels, selectedOptions, setValue]);

  const quote = React.useMemo(
    () =>
      guestCount !== undefined
        ? computeFestifQuote({
            guest_count: guestCount,
            selected_options: selectedOptions ?? [],
            activites_interest: activitesInterest ?? [],
            festif_pack: festifPack,
          })
        : null,
    [guestCount, selectedOptions, activitesInterest, festifPack],
  );

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "instant", block: "start" });

  const goNext = async () => {
    const fields = STEP_FIELDS[step - 1];
    if (!fields) return;
    const valid =
      fields.length === 0
        ? true
        : await trigger(fields as Parameters<typeof trigger>[0]);
    if (valid) {
      scrollToForm();
      setStep((s) => s + 1);
    } else {
      setValidationAttempt((n) => n + 1);
      setTimeout(() => {
        const firstAlert = formRef.current?.querySelector('[role="alert"]');
        firstAlert?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  };

  const goBack = () => {
    scrollToForm();
    setStep((s) => s - 1);
  };

  const onSubmit = (values: FestifLeadInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitFestifLead(values);
      if (!result.success) setServerError(result.error ?? "Une erreur est survenue.");
    });
  };

  return (
    <form
      ref={formRef}
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <input type="hidden" {...register("funnel_type")} value="festif" />
      <input type="hidden" {...register("source_page")} value="/festif" />

      <StepIndicator current={step} step3Label="Votre ambiance" />

      {/* ── Étape 1 : Votre événement ── */}
      <div className={cn("flex flex-col gap-4", step !== 1 && "hidden")}>
        {/* event_type */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quel événement souhaitez-vous organiser ?
          </SectionQuestion>
          <Controller
            control={control}
            name="event_type"
            render={({ field }) => (
              <IconCardSelect
                options={festifEventTypeOptions}
                value={field.value}
                onChange={field.onChange}
                iconSet="festif"
              />
            )}
          />
          {errors.event_type && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.event_type.message}
            </p>
          )}
        </div>

        {/* guest_count stepper */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Combien serez-vous environ ?
          </SectionQuestion>
          <Controller
            control={control}
            name="guest_count"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border-2 border-line bg-surface-elevated px-5 py-4">
                <button
                  type="button"
                  onClick={() =>
                    field.onChange(Math.max(1, (field.value ?? 5) - 5))
                  }
                  className={stepperBtnClass}
                  aria-label="Diminuer"
                >
                  −
                </button>
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={1}
                    max={2000}
                    value={field.value ?? ""}
                    placeholder="—"
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      field.onChange(!isNaN(v) && v >= 1 ? Math.min(v, 2000) : undefined);
                    }}
                    className="w-20 bg-transparent text-center font-serif text-5xl font-semibold leading-none text-ink outline-none placeholder:text-ink-subtle [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-subtle">
                    {field.value === 1 ? "personne" : "personnes"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => field.onChange((field.value ?? 0) + 5)}
                  className={stepperBtnClass}
                  aria-label="Augmenter"
                >
                  +
                </button>
              </div>
            )}
          />
          {errors.guest_count && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.guest_count.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Étape 2 : Votre date ── */}
      <div className={cn("flex flex-col gap-4", step !== 2 && "hidden")}>
        {/* event_date — calendrier */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quelle serait la date de début ?
          </SectionQuestion>
          <Controller
            control={control}
            name="event_date"
            render={({ field }) => (
              <CalendarPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.event_date && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.event_date.message}
            </p>
          )}
        </div>

        {/* event_end_date — calendrier */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quelle serait la date de fin ?
          </SectionQuestion>
          <Controller
            control={control}
            name="event_end_date"
            render={({ field }) => (
              <CalendarPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.event_end_date && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.event_end_date.message}
            </p>
          )}
        </div>

        {/* date_flexibility */}
        <div className="flex flex-col gap-2">
          <SectionQuestion required>
            La date est-elle flexible ?
          </SectionQuestion>
          <Controller
            control={control}
            name="date_flexibility"
            render={({ field }) => (
              <PillSelect
                options={dateFlexibilityOptions}
                value={field.value}
                onChange={field.onChange}
                getLabel={(v) =>
                  dateFlexibilityLabels[v as (typeof dateFlexibilityOptions)[number]]
                }
              />
            )}
          />
          {errors.date_flexibility && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.date_flexibility.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Étape 3 : Votre ambiance ── */}
      <div className={cn("flex flex-col gap-4", step !== 3 && "hidden")}>
        {/* Pack Festif — sélection optionnelle */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Souhaitez-vous partir d&apos;un pack prédéfini ? (facultatif)
          </SectionQuestion>
          <Controller
            control={control}
            name="festif_pack"
            render={({ field }) => (
              <CardSelect
                options={festifPackOptions}
                value={field.value ?? undefined}
                onChange={(v) => {
                  field.onChange(field.value === v ? "" : v);
                }}
                cols={2}
                getLabel={(v) =>
                  festifPackLabels[v as (typeof festifPackOptions)[number]]
                }
              />
            )}
          />
          <p className="text-xs leading-relaxed text-ink-subtle">
            Si aucun pack ne correspond, le devis sera calculé selon le nombre de participants.
          </p>
        </div>

        {/* ambiance */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Quelle ambiance imaginez-vous ?
          </SectionQuestion>
          <Controller
            control={control}
            name="ambiance"
            render={({ field }) => (
              <CardSelect
                options={festifAmbianceOptions}
                value={field.value ?? undefined}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
        </div>

        {/* selected_options */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Quelles expériences vous intéressent ?
          </SectionQuestion>
          <Controller
            control={control}
            name="selected_options"
            render={({ field }) => (
              <MultiCardSelect
                options={festifSelectedOptions}
                value={field.value}
                onChange={field.onChange}
                cols={3}
                disabledOptions={packIncludedLabels}
              />
            )}
          />
        </div>

        {/* Activités partenaires — toggle Oui/Non, puis cartes TYPE B & C */}
        <div className="flex flex-col gap-3">
          <div>
            <SectionQuestion>
              Souhaitez-vous des activités avec nos partenaires ?
            </SectionQuestion>
            <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
              Ces extras ne sont pas inclus dans le devis estimatif — notre équipe vous contactera pour en discuter.
            </p>
          </div>
          <PillSelect
            options={["oui", "non"] as const}
            value={activitesToggle}
            onChange={(v) => {
              setActivitesToggle(v as "oui" | "non");
              if (v === "non") setValue("activites_interest", []);
            }}
            getLabel={(v) => (v === "oui" ? "Oui" : "Non")}
          />

          {activitesToggle === "oui" && (
            <Controller
              control={control}
              name="activites_interest"
              render={({ field }) => {
                const sel = field.value ?? [];
                const toggle = (label: (typeof festifActivitesInterestOptions)[number]) =>
                  field.onChange(
                    sel.includes(label)
                      ? sel.filter((v) => v !== label)
                      : [...sel, label],
                  );
                return (
                  <div className="grid grid-cols-2 gap-2">
                    {FESTIF_ACTIVITY_OPTIONS.map((act) => {
                      const isSelected = sel.includes(
                        act.formLabel as (typeof festifActivitesInterestOptions)[number],
                      );
                      return (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() =>
                            toggle(
                              act.formLabel as (typeof festifActivitesInterestOptions)[number],
                            )
                          }
                          className={cn(
                            "flex flex-col items-start gap-1.5 rounded-[var(--radius-md)] border-2 px-3 py-3 text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.95]",
                            isSelected
                              ? "border-accent bg-accent/[0.12] text-ink shadow-[0_0_22px_var(--card-glow)]"
                              : "border-line bg-surface-elevated text-ink-muted hover:border-accent/50 hover:text-ink hover:scale-[1.01]",
                          )}
                        >
                          <span className={cn("shrink-0", isSelected ? "text-accent" : "text-ink-muted")}>
                            {ACTIVITY_ICONS[act.formLabel]}
                          </span>
                          <span className="text-sm font-medium leading-snug text-current">
                            {act.formLabel}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.1em] text-ink-subtle">
                            {act.indicativePrice ?? "Sur demande"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
          )}
        </div>

        {/* Estimation indicative — TYPE A uniquement */}
        <QuotePreview quote={quote} />
      </div>

      {/* ── Étape 4 : Budget & timing ── */}
      <div className={cn("flex flex-col gap-4", step !== 4 && "hidden")}>
        {/* Rappel estimation */}
        <QuotePreview quote={quote} />

        {/* budget_range */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quel budget souhaitez-vous viser pour l&apos;événement ?
          </SectionQuestion>
          <Controller
            control={control}
            name="budget_range"
            render={({ field }) => (
              <CardSelect
                options={budgetRangeOptions}
                value={field.value}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
          {errors.budget_range && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.budget_range.message}
            </p>
          )}
        </div>

        {/* project_stage */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Où en êtes-vous dans votre organisation ?
          </SectionQuestion>
          <Controller
            control={control}
            name="project_stage"
            render={({ field }) => (
              <CardSelect
                options={projectStageOptions}
                value={field.value}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
          {errors.project_stage && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.project_stage.message}
            </p>
          )}
        </div>

        {/* message */}
        <FormField
          id="f-message"
          label="Un message à ajouter ?"
          error={errors.message?.message}
        >
          <textarea
            rows={3}
            className={fieldBaseClass}
            placeholder="Partagez votre idée, l'ambiance recherchée ou tout point important."
            {...register("message")}
          />
        </FormField>
      </div>

      {/* ── Étape 5 : Vos coordonnées ── */}
      <div className={cn("flex flex-col gap-4", step !== 5 && "hidden")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="f-first-name"
            label="Prénom"
            required
            error={errors.first_name?.message}
          >
            <input
              type="text"
              autoComplete="given-name"
              className={fieldBaseClass}
              placeholder="Prénom"
              {...register("first_name")}
            />
          </FormField>
          <FormField
            id="f-last-name"
            label="Nom"
            required
            error={errors.last_name?.message}
          >
            <input
              type="text"
              autoComplete="family-name"
              className={fieldBaseClass}
              placeholder="Nom"
              {...register("last_name")}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="f-email"
            label="E-mail"
            required
            error={errors.email?.message}
          >
            <input
              type="email"
              autoComplete="email"
              className={fieldBaseClass}
              placeholder="votre@email.fr"
              {...register("email")}
            />
          </FormField>
          <FormField
            id="f-phone"
            label="Téléphone"
            required
            error={errors.phone?.message}
          >
            <PhoneInput
              defaultCountry="FR"
              placeholder="06 12 34 56 78"
              value={phoneValue}
              onChange={(val) =>
                setValue("phone", val ?? "", { shouldValidate: !!errors.phone })
              }
              inputComponent={PhoneInputInner}
              className={cn(
                "flex items-center",
                "border border-line rounded-[var(--radius-md)]",
                "bg-surface-elevated",
                "transition-[border-color,box-shadow] duration-200",
                "focus-within:border-accent-strong focus-within:ring-2 focus-within:ring-accent/40",
                errors.phone && "border-accent-strong ring-2 ring-accent-strong/30",
              )}
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className={cn(checkboxInputClass, "mt-0.5 shrink-0")}
              {...register("rgpd_consent")}
            />
            <span className="text-sm leading-relaxed text-ink-muted">
              J&apos;accepte que mes données soient traitées par le Domaine des
              Élégances afin de répondre à ma demande et de me recontacter.{" "}
              <span className="text-accent-strong" aria-hidden>*</span>
            </span>
          </label>
          {errors.rgpd_consent && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.rgpd_consent.message}
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className={cn(checkboxInputClass, "mt-0.5 shrink-0")}
              {...register("marketing_optin")}
            />
            <span className="text-sm leading-relaxed text-ink-muted">
              J&apos;accepte de recevoir des informations et offres du Domaine
              des Élégances par e-mail. (facultatif)
            </span>
          </label>
        </div>

        {serverError && (
          <p
            role="alert"
            className="rounded-[var(--radius-md)] border border-accent-strong/50 bg-accent-strong/10 px-4 py-3 text-sm text-accent-strong"
          >
            {serverError}
          </p>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="flex flex-col gap-3 pt-1">
        {step < 5 ? (
          <Button
            type="button"
            size="lg"
            variant="primaryGlow"
            onClick={goNext}
            className="w-full"
          >
            Continuer →
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              size="lg"
              variant="primaryGlow"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Envoi en cours..." : "Recevoir ma proposition festive →"}
            </Button>
            <p className="text-center text-xs leading-relaxed text-ink-subtle">
              Réponse sous 24h ouvrées. Proposition transmise sous réserve de
              disponibilité et de validation finale par l&apos;équipe du Domaine
              des Élégances.
            </p>
          </>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="py-1 text-center text-sm text-ink-muted transition-colors hover:text-ink"
          >
            ← Étape précédente
          </button>
        )}
      </div>
    </form>
  );
}
