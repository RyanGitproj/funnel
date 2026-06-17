"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ceremonieLeadSchema,
  type CeremonieLeadInput,
} from "@/lib/validations/lead-schema";
import { submitCeremonieLead } from "@/actions/leads";
import { FormField, fieldBaseClass } from "./FormField";
import { Button } from "@/components/ui/button";

/**
 * LeadFormCeremonie — formulaire Cérémonie (RHF + Zod, client).
 *
 * Flux :
 *   1. Validation client (zodResolver sur le même schéma que le serveur).
 *   2. Soumission → startTransition → appel de la Server Action
 *      `submitCeremonieLead(values)`.
 *   3. La Server Action re-valide (Zod), insère via lib/supabase/leads.ts,
 *      puis redirige vers /confirmation en cas de succès. En cas
 *      d'échec elle renvoie `{ success: false, error }` qu'on affiche.
 *
 * Le champ `nb_invites` est spécifique à l'univers Cérémonie.
 * `date_evenement` est un `<input type="date">` qui renvoie du
 * "AAAA-MM-JJ" nativement, format attendu par le schéma Zod.
 */
const FORM_ID = "lead-form-ceremonie";

export function LeadFormCeremonie() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CeremonieLeadInput>({
    resolver: zodResolver(ceremonieLeadSchema),
    defaultValues: {
      univers: "ceremonie",
      nom: "",
      email: "",
      telephone: "",
      date_evenement: "",
      nb_invites: undefined,
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values: CeremonieLeadInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitCeremonieLead(values);
      if (!result.success) {
        setServerError(result.error);
      }
      // En cas de succès, la Server Action redirige côté serveur.
    });
  };

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      {/* Champ univers — caché, valeur fixe pour la discriminated union Zod */}
      <input type="hidden" {...register("univers")} value="ceremonie" />

      <FormField
        id="ceremonie-nom"
        label="Nom"
        required
        error={errors.nom?.message}
      >
        <input
          type="text"
          autoComplete="name"
          className={fieldBaseClass}
          placeholder="Jeanne Dupont"
          {...register("nom")}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="ceremonie-email"
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
          id="ceremonie-telephone"
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
          id="ceremonie-date"
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
          id="ceremonie-nb-invites"
          label="Nombre d'invités"
          hint="Estimation, même approximative."
          error={errors.nb_invites?.message}
        >
          <input
            type="number"
            min={1}
            max={2000}
            step={1}
            inputMode="numeric"
            className={fieldBaseClass}
            placeholder="120"
            {...register("nb_invites", {
              setValueAs: (v) =>
                v === "" || v === undefined || v === null
                  ? undefined
                  : Number(v),
            })}
          />
        </FormField>
      </div>

      <FormField
        id="ceremonie-message"
        label="Votre message"
        hint="Dites-nous tout : ambiance rêvée, contraintes, questions…"
        error={errors.message?.message}
      >
        <textarea
          rows={5}
          className={fieldBaseClass}
          placeholder="Nous imaginons une cérémonie en extérieur, vers le coucher du soleil…"
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
          variant="primary"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Envoi en cours…" : "Préparer mon devis cérémonie"}
        </Button>
      </div>
    </form>
  );
}
