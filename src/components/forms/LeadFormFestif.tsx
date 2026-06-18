"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  budgetRangeOptions,
  festifAmbianceOptions,
  festifDateFlexibilityOptions,
  festifDurationOptions,
  festifEventTypeOptions,
  festifLeadSchema,
  festifParticipantProfileOptions,
  festifSelectedOptions,
  projectStageOptions,
  type FestifLeadInput,
} from "@/lib/validations/lead-schema";
import { submitFestifLead } from "@/actions/leads";
import { FormField, fieldBaseClass, fieldSelectClass } from "./FormField";
import { Button } from "@/components/ui/button";

const FORM_ID = "lead-form-festif";

const OPTION_CLASS =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface-elevated px-3 py-2 text-sm text-ink transition-colors hover:border-accent";
const CHECKBOX_CLASS = "size-4 shrink-0 accent-[var(--accent-strong)]";

const STEP_LABELS = ["Coordonnées", "Événement", "Projet"] as const;

const STEP_FIELDS: (keyof FestifLeadInput)[][] = [
  ["first_name", "last_name", "email", "phone"],
  ["event_type", "event_date", "guest_count", "duration"],
  ["budget_range", "project_stage"],
];

function StepIndicator({ current }: { current: number }) {
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

export function LeadFormFestif() {
  const [step, setStep] = React.useState(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FestifLeadInput>({
    resolver: zodResolver(festifLeadSchema),
    defaultValues: {
      funnel_type: "festif",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      event_type: undefined,
      event_date: "",
      date_flexibility: undefined,
      guest_count: undefined,
      participant_profile: undefined,
      duration: undefined,
      selected_options: [],
      ambiance: undefined,
      budget_range: undefined,
      project_stage: undefined,
      message: "",
    },
  });

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "instant", block: "start" });

  const goNext = async () => {
    const fields = STEP_FIELDS[step - 1];
    if (!fields) return;
    const valid = await trigger(fields as Parameters<typeof trigger>[0]);
    if (valid) {
      scrollToForm();
      setStep((s) => s + 1);
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
      className="flex flex-col gap-5"
    >
      <input type="hidden" {...register("funnel_type")} value="festif" />

      <StepIndicator current={step} />

      {/* ── Étape 1 : Coordonnées ── */}
      <div className={cn("flex flex-col gap-4", step !== 1 && "hidden")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="f-first-name"
            label="Prénom"
            error={errors.first_name?.message}
          >
            <input
              type="text"
              autoComplete="given-name"
              className={fieldBaseClass}
              placeholder="Camille"
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
              placeholder="Rousseau"
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
              placeholder="camille@email.fr"
              {...register("email")}
            />
          </FormField>
          <FormField
            id="f-phone"
            label="Téléphone"
            required
            error={errors.phone?.message}
          >
            <input
              type="tel"
              autoComplete="tel"
              className={fieldBaseClass}
              placeholder="+33 6 12 34 56 78"
              {...register("phone")}
            />
          </FormField>
        </div>
      </div>

      {/* ── Étape 2 : Événement ── */}
      <div className={cn("flex flex-col gap-4", step !== 2 && "hidden")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="f-event-type"
            label="Type d'événement"
            required
            error={errors.event_type?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("event_type")}
            >
              <option value="" disabled>
                Sélectionner...
              </option>
              {festifEventTypeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            id="f-event-date"
            label="Date souhaitée"
            required
            error={errors.event_date?.message}
          >
            <input
              type="date"
              className={fieldBaseClass}
              {...register("event_date")}
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="f-duration"
            label="Durée souhaitée"
            required
            error={errors.duration?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("duration")}
            >
              <option value="" disabled>
                Sélectionner...
              </option>
              {festifDurationOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            id="f-date-flex"
            label="Date flexible ?"
            error={errors.date_flexibility?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("date_flexibility")}
            >
              <option value="">Sélectionner...</option>
              {festifDateFlexibilityOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="f-guest-count"
            label="Nombre de participants"
            required
            error={errors.guest_count?.message}
          >
            <input
              type="number"
              min={1}
              inputMode="numeric"
              className={fieldBaseClass}
              placeholder="12"
              {...register("guest_count", {
                setValueAs: (v) =>
                  v === "" || v === undefined ? undefined : Number(v),
              })}
            />
          </FormField>
          <FormField
            id="f-participant-profile"
            label="Composition du groupe"
            error={errors.participant_profile?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("participant_profile")}
            >
              <option value="">Sélectionner...</option>
              {festifParticipantProfileOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Besoins
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {festifSelectedOptions.map((v) => (
              <label key={v} className={OPTION_CLASS}>
                <input
                  type="checkbox"
                  value={v}
                  className={CHECKBOX_CLASS}
                  {...register("selected_options")}
                />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <FormField
          id="f-ambiance"
          label="Ambiance recherchée"
          error={errors.ambiance?.message}
        >
          <select
            className={fieldSelectClass}
            defaultValue=""
            {...register("ambiance")}
          >
            <option value="">Sélectionner...</option>
            {festifAmbianceOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* ── Étape 3 : Projet ── */}
      <div className={cn("flex flex-col gap-4", step !== 3 && "hidden")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="f-budget"
            label="Budget estimatif global"
            required
            error={errors.budget_range?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("budget_range")}
            >
              <option value="" disabled>
                Sélectionner...
              </option>
              {budgetRangeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            id="f-stage"
            label="Où en êtes-vous ?"
            required
            error={errors.project_stage?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("project_stage")}
            >
              <option value="" disabled>
                Sélectionner...
              </option>
              {projectStageOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField
          id="f-message"
          label="Votre message"
          error={errors.message?.message}
        >
          <textarea
            rows={3}
            className={fieldBaseClass}
            placeholder="Expliquez-nous votre idée, l'ambiance recherchée, vos contraintes ou les points importants à connaître."
            {...register("message")}
          />
        </FormField>
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
        {step < 3 ? (
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
              {isPending ? "Envoi en cours..." : "Obtenir mon devis festif →"}
            </Button>
            <p className="text-center text-xs leading-relaxed text-ink-subtle">
              Réponse sous 24h ouvrées. Proposition transmise sous réserve de
              disponibilité et de validation finale par l'équipe du Domaine des
              Élégances.
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
