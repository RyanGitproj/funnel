"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, useWatch, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  contactPreparationStageOptions,
  contactSchema,
  type ContactInput,
} from "@/lib/validations/contact-schema";
import { submitContact } from "@/actions/contact";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";
import { readUtmParams, rememberUtmParams } from "@/lib/tracking/utm";
import {
  FormField,
  fieldBaseClass,
  checkboxInputClass,
  CardSelect,
  PhoneInputInner,
} from "./FormField";
import { Button } from "@/components/ui/button";

const FOCUSABLE_SELECTOR =
  'input, button, textarea, select, a[href], [tabindex]:not([tabindex="-1"])';

/**
 * Popup bloquant de capture de contact. Volontairement infermable :
 * ni croix, ni Escape, ni clic sur l'overlay — le visiteur doit
 * renseigner ses coordonnées pour accéder au contenu.
 *
 * Rendu inline (pas de portal) pour que l'overlay soit présent dès le
 * HTML serveur sur la page d'accueil, sans flash de contenu. Dans les
 * funnels, le monter APRÈS le </form> (fragment) — jamais à
 * l'intérieur : les formulaires imbriqués sont invalides en HTML.
 */
export function ContactGateModal({
  open,
  sourcePage,
  onSubmitted,
  ctaLabel = "Découvrir le domaine →",
}: {
  open: boolean;
  /** Page où le contact est capturé ("/", "/ceremonie", "/festif"). */
  sourcePage: string;
  /** Fermeture (accueil) ou resoumission du devis en attente (funnels). */
  onSubmitted: () => void;
  ctaLabel?: string;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      preparation_stage: undefined,
      rgpd_consent: false,
      marketing_optin: false,
      source_page: sourcePage,
    },
  });

  const phoneValue = useWatch({ control, name: "phone", defaultValue: "" });

  // Le modal est monté sur toutes les pages d'atterrissage possibles
  // (/, /ceremonie, /festif) : on mémorise les UTM dès l'arrivée, avant
  // toute navigation interne qui perdrait la query string.
  React.useEffect(() => {
    rememberUtmParams();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    pushDataLayerEvent("contact_gate_open", { source_page: sourcePage });
    document.body.style.overflow = "hidden";
    cardRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, sourcePage]);

  // Piège de focus minimal : Tab boucle dans la carte. Pas de handler
  // Escape — le dialog ne doit pas pouvoir se fermer.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusables =
      cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onSubmit = (values: ContactInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitContact({ ...values, ...readUtmParams() });
      if (result.success) {
        pushDataLayerEvent("contact_gate_submit", {
          source_page: sourcePage,
          preparation_stage: values.preparation_stage,
        });
        onSubmitted();
        return;
      }
      setServerError(result.error ?? "Une erreur est survenue.");
    });
  };

  if (!open) return null;

  return (
    <div
      data-theme="accueil"
      className="fixed inset-0 z-[45] overflow-y-auto bg-ink/45 p-4 backdrop-blur-md sm:p-6"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-fade-in-up mx-auto my-2 w-full max-w-2xl rounded-[var(--radius-lg)] border border-accent/40 bg-surface-elevated p-5 shadow-soft outline-none md:p-7"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/images/brand/logo-domaine-des-elegances.png"
            alt="Domaine des Élégances"
            width={150}
            height={100}
            priority
            className="mix-blend-multiply"
          />
          <p className="text-eyebrow text-accent-strong">
            Domaine privé · Yvelines
          </p>
          <h2
            id={titleId}
            className="font-serif text-xl leading-snug text-ink md:text-2xl"
          >
            Bienvenue au Domaine des Élégances
          </h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            Dites-nous qui vous êtes : nous préparons une estimation adaptée
            à votre projet.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-4 flex flex-col gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="gate-first-name"
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
              id="gate-last-name"
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

          <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            id="gate-email"
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
            id="gate-phone"
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

          <div className="flex flex-col gap-2">
            <p className="font-serif text-base font-medium leading-snug text-ink">
              Où en êtes-vous dans votre préparation ?
              <span className="ml-1 text-accent-strong" aria-hidden>
                *
              </span>
            </p>
            <Controller
              control={control}
              name="preparation_stage"
              render={({ field }) => (
                <CardSelect
                  options={contactPreparationStageOptions}
                  value={field.value}
                  onChange={field.onChange}
                  gridClassName="grid-cols-3"
                />
              )}
            />
            {errors.preparation_stage && (
              <p role="alert" className="text-xs leading-relaxed text-accent-strong">
                {errors.preparation_stage.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className={cn(checkboxInputClass, "mt-0.5 shrink-0")}
                {...register("rgpd_consent")}
              />
              <span className="text-sm leading-relaxed text-ink-muted">
                J&apos;accepte que mes données soient traitées pour répondre
                à ma demande et me recontacter.{" "}
                <span className="text-accent-strong" aria-hidden>*</span>
              </span>
            </label>
            {errors.rgpd_consent && (
              <p role="alert" className="text-xs leading-relaxed text-accent-strong">
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
                Je souhaite recevoir les offres du Domaine par e-mail.
                (facultatif)
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

          <Button
            type="submit"
            size="lg"
            variant="primary"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Envoi en cours..." : ctaLabel}
          </Button>

          <p className="text-center text-xs leading-relaxed text-ink-subtle">
            Vos coordonnées restent confidentielles.
          </p>
        </form>
      </div>
    </div>
  );
}
