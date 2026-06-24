"use client";

import * as React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  budgetRangeOptions,
  ceremonieAmbianceOptions,
  ceremonieEventTypeOptions,
  ceremonieFormatOptions,
  ceremonieLeadSchema,
  ceremonieSelectedOptions,
  dateFlexibilityLabels,
  dateFlexibilityOptions,
  projectStageOptions,
  type CeremonieLeadInput,
} from "@/lib/validations/lead-schema";
import { submitCeremonieLead } from "@/actions/leads";
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
import { computeCeremonieQuote } from "@/lib/quote/quoteCalculator";

const FORM_ID = "lead-form-ceremonie";

const STEP_FIELDS: (keyof CeremonieLeadInput)[][] = [
  ["event_type", "guest_count"],
  ["event_date", "date_flexibility"],
  ["ceremony_format"],
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

export function LeadFormCeremonie() {
  const [step, setStep] = React.useState(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [validationAttempt, setValidationAttempt] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors },
  } = useForm<CeremonieLeadInput>({
    resolver: zodResolver(ceremonieLeadSchema),
    defaultValues: {
      funnel_type: "ceremonie",
      source_page: "/ceremonie",
      event_type: undefined,
      event_date: "",
      date_flexibility: undefined,
      guest_count: undefined,
      ceremony_format: undefined,
      selected_options: [],
      ambiance: undefined,
      heater_count: undefined,
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
  const heaterCount = useWatch({ control, name: "heater_count" });

  const hasHeater = selectedOptions?.includes("Chauffage");

  const quote = React.useMemo(
    () =>
      guestCount !== undefined
        ? computeCeremonieQuote({
            guest_count: guestCount,
            selected_options: selectedOptions ?? [],
            heater_count: heaterCount,
          })
        : null,
    [guestCount, selectedOptions, heaterCount],
  );

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "instant", block: "start" });

  const goNext = async () => {
    const fields = STEP_FIELDS[step - 1];
    if (!fields) return;
    const valid = await trigger(fields as Parameters<typeof trigger>[0]);
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

  const onSubmit = (values: CeremonieLeadInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitCeremonieLead(values);
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
      <input type="hidden" {...register("funnel_type")} value="ceremonie" />
      <input type="hidden" {...register("source_page")} value="/ceremonie" />

      <StepIndicator current={step} step3Label="Votre réception" />

      {/* ── Étape 1 : Votre moment ── */}
      <div className={cn("flex flex-col gap-4", step !== 1 && "hidden")}>
        {/* event_type */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quel moment souhaitez-vous célébrer ?
          </SectionQuestion>
          <Controller
            control={control}
            name="event_type"
            render={({ field }) => (
              <IconCardSelect
                options={ceremonieEventTypeOptions}
                value={field.value}
                onChange={field.onChange}
                iconSet="ceremonie"
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
            Combien d&apos;invités imaginez-vous ?
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
                    {field.value === 1 ? "invité" : "invités"}
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
            Pour quelle date envisagez-vous votre cérémonie ?
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

      {/* ── Étape 3 : Votre réception ── */}
      <div className={cn("flex flex-col gap-4", step !== 3 && "hidden")}>
        {/* ceremony_format */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quel format ressemble le plus à votre idée ?
          </SectionQuestion>
          <Controller
            control={control}
            name="ceremony_format"
            render={({ field }) => (
              <CardSelect
                options={ceremonieFormatOptions}
                value={field.value}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
          {errors.ceremony_format && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.ceremony_format.message}
            </p>
          )}
        </div>

        {/* selected_options */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Quels éléments souhaitez-vous prévoir ?
          </SectionQuestion>
          <Controller
            control={control}
            name="selected_options"
            render={({ field }) => (
              <MultiCardSelect
                options={ceremonieSelectedOptions}
                value={field.value}
                onChange={field.onChange}
                cols={3}
              />
            )}
          />
        </div>

        {/* heater_count — conditionnel si "Chauffage" sélectionné */}
        {hasHeater && (
          <div className="flex flex-col gap-3">
            <SectionQuestion>
              Combien d&apos;appareils de chauffage prévoyez-vous ?
            </SectionQuestion>
            <Controller
              control={control}
              name="heater_count"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border-2 border-line bg-surface-elevated px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(Math.max(1, (field.value ?? 1) - 1))
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
                      value={field.value ?? 1}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        field.onChange(!isNaN(v) && v >= 1 ? Math.min(v, 20) : 1);
                      }}
                      className="w-20 bg-transparent text-center font-serif text-5xl font-semibold leading-none text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-subtle">
                      {(field.value ?? 1) === 1 ? "appareil" : "appareils"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(Math.min(20, (field.value ?? 1) + 1))
                    }
                    className={stepperBtnClass}
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                </div>
              )}
            />
          </div>
        )}

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
                options={ceremonieAmbianceOptions}
                value={field.value ?? undefined}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
        </div>

        {/* Estimation indicative — visible dès l'étape 3 */}
        <QuotePreview quote={quote} />
      </div>

      {/* ── Étape 4 : Votre projet ── */}
      <div className={cn("flex flex-col gap-4", step !== 4 && "hidden")}>
        {/* Rappel estimation */}
        <QuotePreview quote={quote} />

        {/* budget_range */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quel est votre budget global estimatif ?
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
            Où en êtes-vous dans votre projet ?
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
          id="c-message"
          label="Un message à ajouter ?"
          error={errors.message?.message}
        >
          <textarea
            rows={3}
            className={fieldBaseClass}
            placeholder="Partagez vos attentes, l'ambiance souhaitée ou tout point important."
            {...register("message")}
          />
        </FormField>
      </div>

      {/* ── Étape 5 : Vos coordonnées ── */}
      <div className={cn("flex flex-col gap-4", step !== 5 && "hidden")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="c-first-name"
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
            id="c-last-name"
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
            id="c-email"
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
            id="c-phone"
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
            variant="primary"
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
              variant="primary"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Envoi en cours..." : "Recevoir ma proposition cérémonie →"}
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
