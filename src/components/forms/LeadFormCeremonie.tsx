"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  budgetRangeOptions,
  ceremonieConstraintOptions,
  ceremonieEventTypeOptions,
  ceremonieFormatOptions,
  ceremonieLeadSchema,
  ceremonieProjectPriorityOptions,
  ceremonieSelectedOptions,
  dateFlexibilityLabels,
  dateFlexibilityOptions,
  projectStageOptions,
  type CeremonieLeadInput,
} from "@/lib/validations/lead-schema";
import { submitCeremonieLead } from "@/actions/leads";
import { FormField, fieldBaseClass, fieldSelectClass } from "./FormField";
import { Button } from "@/components/ui/button";

const FORM_ID = "lead-form-ceremonie";

const OPTION_CLASS =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface-elevated px-3 py-2 text-sm text-ink transition-colors hover:border-accent";
const CHECKBOX_CLASS = "size-4 shrink-0 accent-[var(--accent-strong)]";

const STEP_LABELS = ["Coordonnées", "Événement", "Projet"] as const;

const STEP_FIELDS: (keyof CeremonieLeadInput)[][] = [
  ["first_name", "last_name", "email", "phone"],
  [
    "event_type",
    "event_date",
    "date_flexibility",
    "guest_count",
    "ceremony_format",
  ],
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

export function LeadFormCeremonie() {
  const [step, setStep] = React.useState(1);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CeremonieLeadInput>({
    resolver: zodResolver(ceremonieLeadSchema),
    defaultValues: {
      funnel_type: "ceremonie",
      source_page: "/ceremonie",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      event_type: undefined,
      event_date: "",
      date_flexibility: undefined,
      guest_count: undefined,
      adult_count: undefined,
      children_count: undefined,
      ceremony_format: undefined,
      selected_options: [],
      project_priority: undefined,
      budget_range: undefined,
      project_stage: undefined,
      constraints: [],
      message: "",
    },
  });

  const numReg = (name: "guest_count" | "adult_count" | "children_count") =>
    register(name, {
      setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)),
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
      className="flex flex-col gap-5"
    >
      <input type="hidden" {...register("funnel_type")} value="ceremonie" />
      <input type="hidden" {...register("source_page")} value="/ceremonie" />

      <StepIndicator current={step} />

      {/* ── Étape 1 : Coordonnées ── */}
      <div className={cn("flex flex-col gap-4", step !== 1 && "hidden")}>
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
              placeholder="Jeanne"
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
              placeholder="Dupont"
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
              placeholder="jeanne.dupont@email.fr"
              {...register("email")}
            />
          </FormField>
          <FormField
            id="c-phone"
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
            id="c-event-type"
            label="Type de cérémonie"
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
              {ceremonieEventTypeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            id="c-format"
            label="Format souhaité"
            required
            error={errors.ceremony_format?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("ceremony_format")}
            >
              <option value="" disabled>
                Sélectionner...
              </option>
              {ceremonieFormatOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="c-event-date"
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
          <FormField
            id="c-date-flex"
            label="Date flexible ?"
            error={errors.date_flexibility?.message}
          >
            <select
              className={fieldSelectClass}
              defaultValue=""
              {...register("date_flexibility")}
            >
              <option value="">Sélectionner...</option>
              {dateFlexibilityOptions.map((v) => (
                <option key={v} value={v}>
                  {dateFlexibilityLabels[v]}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormField
            id="c-guests"
            label="Total invités"
            required
            error={errors.guest_count?.message}
          >
            <input
              type="number"
              min={1}
              inputMode="numeric"
              className={fieldBaseClass}
              placeholder="80"
              {...numReg("guest_count")}
            />
          </FormField>
          <FormField
            id="c-adults"
            label="Adultes"
            error={errors.adult_count?.message}
          >
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className={fieldBaseClass}
              placeholder="60"
              {...numReg("adult_count")}
            />
          </FormField>
          <FormField
            id="c-children"
            label="Enfants"
            error={errors.children_count?.message}
          >
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className={fieldBaseClass}
              placeholder="12"
              {...numReg("children_count")}
            />
          </FormField>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Besoins
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {ceremonieSelectedOptions.map((v) => (
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
      </div>

      {/* ── Étape 3 : Projet ── */}
      <div className={cn("flex flex-col gap-4", step !== 3 && "hidden")}>
        <FormField
          id="c-priority"
          label="Ce qui compte le plus"
          error={errors.project_priority?.message}
        >
          <select
            className={fieldSelectClass}
            defaultValue=""
            {...register("project_priority")}
          >
            <option value="">Sélectionner...</option>
            {ceremonieProjectPriorityOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="c-budget"
            label="Budget estimatif"
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
            id="c-stage"
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
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Contraintes
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {ceremonieConstraintOptions.map((v) => (
              <label key={v} className={OPTION_CLASS}>
                <input
                  type="checkbox"
                  value={v}
                  className={CHECKBOX_CLASS}
                  {...register("constraints")}
                />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <FormField
          id="c-message"
          label="Votre message"
          error={errors.message?.message}
        >
          <textarea
            rows={3}
            className={fieldBaseClass}
            placeholder="Expliquez-nous votre projet, vos attentes, vos contraintes ou les points importants à connaître."
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
              {isPending ? "Envoi en cours..." : "Préparer mon devis cérémonie →"}
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
