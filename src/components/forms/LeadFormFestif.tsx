"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  festifLeadSchema,
  type FestifLeadInput,
} from "@/lib/validations/lead-schema";
import { submitFestifLead } from "@/actions/leads";
import { FormField, fieldBaseClass, fieldSelectClass } from "./FormField";
import { Button } from "@/components/ui/button";

/**
 * LeadFormFestif — formulaire Festif (RHF + Zod, client).
 *
 * Flux identique au formulaire Cérémonie (cf. LeadFormCeremonie) ;
 * la différence est le champ `type_activite` (select EVJF/EVG/…) à la
 * place de `nb_invites`.
 *
 * Le select utilise `fieldSelectClass` qui ajoute un padding droit pour
 * le chevron natif (on garde le contrôle natif du navigateur pour
 * l'accessibilité clavier + l'apparence native sur mobile).
 */
const FORM_ID = "lead-form-festif";

const TYPE_ACTIVITE_OPTIONS: { value: FestifLeadInput["type_activite"]; label: string }[] = [
  { value: "EVJF", label: "EVJF — Enterrement de vie de jeune fille" },
  { value: "EVG", label: "EVG — Enterrement de vie de garçon" },
  { value: "Anniversaire", label: "Anniversaire" },
  { value: "Autre événement festif", label: "Autre événement festif" },
];

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
        label="Nom"
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
          id="festif-date"
          label="Date souhaitée"
          hint="Indicative — nous ajusterons ensemble."
          error={errors.date_evenement?.message}
        >
          <input
            type="date"
            className={fieldBaseClass}
            {...register("date_evenement")}
          />
        </FormField>

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
              Sélectionner…
            </option>
            {TYPE_ACTIVITE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField
        id="festif-message"
        label="Votre message"
        hint="Ambiance attendue, nombre d'amis, idées d'activités…"
        error={errors.message?.message}
      >
        <textarea
          rows={5}
          className={fieldBaseClass}
          placeholder="Nous sommes un groupe de 12 amies pour un EVJF en juin…"
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
          Réponse sous 24h ouvrées · Devis personnalisé sans engagement
        </p>
        <Button
          type="submit"
          size="lg"
          variant="primaryGlow"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Envoi en cours…" : "Obtenir mon devis festif"}
        </Button>
      </div>
    </form>
  );
}
