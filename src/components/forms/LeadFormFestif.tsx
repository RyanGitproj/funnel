"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  festifAmbianceOptions,
  festifBesoinOptions,
  festifDateFlexibleOptions,
  festifDureeOptions,
  festifLeadSchema,
  festifMaturiteOptions,
  festifTypeActiviteOptions,
  type FestifLeadInput,
} from "@/lib/validations/lead-schema";
import { submitFestifLead } from "@/actions/leads";
import { FormField, fieldBaseClass, fieldSelectClass } from "./FormField";
import { Button } from "@/components/ui/button";

const FORM_ID = "lead-form-festif";

const TYPE_ACTIVITE_LABELS: Record<FestifLeadInput["type_activite"], string> = {
  EVJF: "EVJF",
  EVG: "EVG",
  Anniversaire: "Anniversaire",
  "Week-end": "Week-end",
  Autre: "Autre",
};

const RADIO_GROUP_CLASS = "grid gap-3 sm:grid-cols-2";
const OPTION_CLASS =
  "flex min-h-12 items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface-elevated px-4 py-3 text-sm text-ink transition-colors hover:border-accent";
const CHECKBOX_CLASS =
  "size-4 shrink-0 accent-[var(--accent-strong)]";

export function LeadFormFestif() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<FestifLeadInput>({
    resolver: zodResolver(festifLeadSchema),
    defaultValues: {
      univers: "festif",
      nom: "",
      email: "",
      telephone: "",
      date_evenement: "",
      type_activite: undefined,
      date_flexible: undefined,
      nombre_participants: undefined,
      duree: undefined,
      besoins: [],
      ambiance: undefined,
      budget_estime: "",
      maturite: undefined,
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values: FestifLeadInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitFestifLead(values);
      if (!result.success) {
        setServerError(result.error);
      }
    });
  };

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <input type="hidden" {...register("univers")} value="festif" />

      <FormField
        id="festif-nom"
        label="Nom / Prénom"
        required
        error={errors.nom?.message}
      >
        <input
          type="text"
          autoComplete="name"
          className={fieldBaseClass}
          placeholder="Camille Rousseau"
          {...register("nom")}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="festif-email"
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
          id="festif-telephone"
          label="Téléphone"
          required
          error={errors.telephone?.message}
        >
          <input
            type="tel"
            autoComplete="tel"
            className={fieldBaseClass}
            placeholder="+33 6 12 34 56 78"
            {...register("telephone")}
          />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="festif-type-activite"
          label="Type d'événement"
          required
          error={errors.type_activite?.message}
        >
          <select
            className={fieldSelectClass}
            defaultValue=""
            {...register("type_activite")}
          >
            <option value="" disabled>
              Sélectionner...
            </option>
            {festifTypeActiviteOptions.map((value) => (
              <option key={value} value={value}>
                {TYPE_ACTIVITE_LABELS[value]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="festif-date"
          label="Date souhaitée"
          required
          hint="Même indicative, elle nous aide à vérifier les disponibilités."
          error={errors.date_evenement?.message}
        >
          <input
            type="date"
            className={fieldBaseClass}
            {...register("date_evenement")}
          />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <FormField
          id="festif-date-flexible"
          label="Flexibilité date"
          required
          error={errors.date_flexible?.message}
        >
          <select
            className={fieldSelectClass}
            defaultValue=""
            {...register("date_flexible")}
          >
            <option value="" disabled>
              Sélectionner...
            </option>
            {festifDateFlexibleOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="festif-participants"
          label="Participants"
          required
          error={errors.nombre_participants?.message}
        >
          <input
            type="number"
            min={1}
            inputMode="numeric"
            className={fieldBaseClass}
            placeholder="12"
            {...register("nombre_participants", {
              setValueAs: (value) =>
                value === "" || value === undefined ? undefined : Number(value),
            })}
          />
        </FormField>

        <FormField
          id="festif-duree"
          label="Durée"
          required
          error={errors.duree?.message}
        >
          <select className={fieldSelectClass} defaultValue="" {...register("duree")}>
            <option value="" disabled>
              Sélectionner...
            </option>
            {festifDureeOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Besoins <span className="text-accent-strong">*</span>
        </legend>
        <div className={RADIO_GROUP_CLASS}>
          {festifBesoinOptions.map((value) => (
            <label key={value} className={OPTION_CLASS}>
              <input
                type="checkbox"
                value={value}
                className={CHECKBOX_CLASS}
                {...register("besoins")}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
        {errors.besoins?.message && (
          <p role="alert" className="text-xs leading-relaxed text-accent-strong">
            {errors.besoins.message}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="festif-ambiance"
          label="Ambiance"
          required
          error={errors.ambiance?.message}
        >
          <select
            className={fieldSelectClass}
            defaultValue=""
            {...register("ambiance")}
          >
            <option value="" disabled>
              Sélectionner...
            </option>
            {festifAmbianceOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="festif-budget"
          label="Budget estimé"
          required
          error={errors.budget_estime?.message}
        >
          <input
            type="text"
            className={fieldBaseClass}
            placeholder="Enveloppe globale envisagée"
            {...register("budget_estime")}
          />
        </FormField>
      </div>

      <FormField
        id="festif-maturite"
        label="Niveau de maturité"
        required
        error={errors.maturite?.message}
      >
        <select
          className={fieldSelectClass}
          defaultValue=""
          {...register("maturite")}
        >
          <option value="" disabled>
            Sélectionner...
          </option>
          {festifMaturiteOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id="festif-message"
        label="Message libre"
        required
        hint="Quelques mots suffisent : contexte, envies, contraintes."
        error={errors.message?.message}
      >
        <textarea
          rows={5}
          className={fieldBaseClass}
          placeholder="Nous sommes un groupe de 12 amies pour un EVJF en juin..."
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-subtle">
          Réponse sous 24h ouvrées. Sous réserve de disponibilité et validation finale.
        </p>
        <Button
          type="submit"
          size="lg"
          variant="primaryGlow"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Envoi en cours..." : "Obtenir mon devis festif →"}
        </Button>
      </div>
    </form>
  );
}
