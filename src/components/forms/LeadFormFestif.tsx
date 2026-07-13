"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, useWatch, Controller } from "react-hook-form";
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
  type FestifLeadFormValues,
  type FestifLeadInput,
} from "@/lib/validations/lead-schema";
import {
  FESTIF_ACTIVITY_OPTIONS,
  FESTIF_BUFFET_OPTIONS,
  FESTIF_CADEAU_OPTIONS,
  FESTIF_INTERVENANTS,
  FESTIF_MATERIEL,
  FESTIF_REPAS_OPTIONS,
  FESTIF_SERVICE_COURSES,
  FESTIF_LOISIRS_PACKS_BY_EVENT,
  toEventTypeFestif,
} from "@/config/pricing/festif";
import { submitFestifLead } from "@/actions/leads";
import {
  FormField,
  fieldBaseClass,
  CardSelect,
  IconCardSelect,
  PillSelect,
  CalendarPicker,
  RichCardSelect,
  RichMultiCardSelect,
  stepperBtnClass,
} from "./FormField";
import { ContactGateModal } from "./ContactGateModal";
import { StepIndicator } from "./StepIndicator";
import { Button } from "@/components/ui/button";
import { QuotePreview } from "./QuotePreview";
import { computeFestifQuote } from "@/lib/quote/quoteCalculator";

const FORM_ID = "lead-form-festif";
const LAST_OPTIONS_STEP = 4;
const FESTIF_STEP_LABELS = [
  "Votre moment",
  "Votre formule",
  "Votre date",
  "Votre ambiance",
  "Votre projet",
] as const;

const STEP_FIELDS: (keyof FestifLeadFormValues)[][] = [
  ["event_type", "guest_count"],
  ["festif_duration"],
  ["event_date", "date_flexibility"],
  ["buffet_choice", "dietary_notes"],
  ["budget_range"],
];

// Cartes durée enrichies
const FESTIF_DURATION_CARDS = [
  {
    value: "semaine_1_nuit" as const,
    label: "Offre semaine — 1 nuit",
    priceHighlight: "Dès 107 € / personne (à partir de 27 pers.)",
    priceGolden: true,
    description: "Une nuit privée au Domaine, nettoyage inclus.",
    conditions: "Lun–jeu · hors vacances scolaires et jours fériés · min. 12 pers.",
    note: "Hors période ? Demandez, on confirme.",
  },
  {
    value: "weekend_2_nuits" as const,
    label: "Week-end — 2 nuits",
    priceHighlight: "À partir de 205 € / personne en groupe complet",
    priceGolden: false,
    description: "Petit-déjeuner essentiel + nettoyage inclus.",
    note: "Prix groupe complet (34 pers.), ajusté à votre nombre.",
  },
  {
    value: "weekend_long_3_nuits" as const,
    label: "Week-end long — 3 nuits",
    priceHighlight: "Estimation à confirmer",
    priceGolden: false,
    description: "Pour prolonger l'expérience.",
    note: "Barème en cours de validation — étude manuelle de votre demande.",
  },
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
  const [gateOpen, setGateOpen] = React.useState(false);
  const [pendingValues, setPendingValues] =
    React.useState<FestifLeadInput | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors },
  } = useForm<FestifLeadFormValues, unknown, FestifLeadInput>({
    resolver: zodResolver(festifLeadSchema),
    defaultValues: {
      funnel_type: "festif",
      source_page: "/festif",
      event_type: undefined,
      event_date: "",
      date_flexibility: undefined,
      guest_count: undefined,
      activites_interest: [],
      ambiance: undefined,
      festif_duration: undefined,
      budget_range: undefined,
      message: "",
      // Phase 2
      loisirs_pack: undefined,
      repas_upgrade: undefined,
      buffet_choice: undefined,
      service_courses: undefined,
      intervenants: [],
      materiel: [],
      dietary_notes: "",
      autre_intervenant_notes: "",
      autre_materiel_notes: "",
      cadeau_choice: undefined,
    },
  });

  const guestCount = useWatch({ control, name: "guest_count" });
  const activitesInterest = useWatch({ control, name: "activites_interest", defaultValue: [] });
  const festifDuration = useWatch({ control, name: "festif_duration" });
  const isSemaineOffer = festifDuration === "semaine_1_nuit";
  // Phase 2
  const eventType = useWatch({ control, name: "event_type" });
  const loisirsPackVal = useWatch({ control, name: "loisirs_pack" });
  const repasUpgrade = useWatch({ control, name: "repas_upgrade" });
  const buffetChoice = useWatch({ control, name: "buffet_choice" });
  const serviceCourses = useWatch({ control, name: "service_courses" });
  const intervenants = useWatch({ control, name: "intervenants", defaultValue: [] });
  const materiel = useWatch({ control, name: "materiel", defaultValue: [] });
  const cadeauChoice = useWatch({ control, name: "cadeau_choice" });

  // Réinitialiser loisirs_pack si event_type change
  React.useEffect(() => {
    setValue("loisirs_pack", undefined);
  }, [eventType, setValue]);

  const quote = React.useMemo(
    () =>
          festifDuration !== undefined
        ? computeFestifQuote({
            guest_count: guestCount,
            activites_interest: activitesInterest ?? [],
            festif_duration: festifDuration,
            event_type: eventType,
            loisirs_pack: loisirsPackVal ?? undefined,
            repas_upgrade: repasUpgrade ?? undefined,
            buffet_choice: buffetChoice ?? undefined,
            service_courses: serviceCourses ?? "none",
            intervenants: intervenants ?? [],
            materiel: materiel ?? [],
            cadeau_choice: cadeauChoice ?? undefined,
          })
        : null,
    [
      festifDuration, guestCount, activitesInterest,
      eventType, loisirsPackVal, repasUpgrade, buffetChoice,
      serviceCourses, intervenants, materiel, cadeauChoice,
    ],
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

  const submitLead = (values: FestifLeadInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitFestifLead(values);
      if (result.success) return;
      if (result.errorCode === "contact_required") {
        // Visiteur sans contact enregistré (arrivée directe, cookie
        // expiré) : le popup capture ses coordonnées puis resoumet.
        setPendingValues(values);
        setGateOpen(true);
        return;
      }
      setServerError(result.error ?? "Une erreur est survenue.");
    });
  };

  const onSubmit = submitLead;

  const handleGateSubmitted = () => {
    setGateOpen(false);
    if (pendingValues) submitLead(pendingValues);
  };

  // Packs loisirs selon type d'événement
  const loisirsPackOptions = React.useMemo(() => {
    const bucket = toEventTypeFestif(eventType);
    return FESTIF_LOISIRS_PACKS_BY_EVENT[bucket].map((p) => ({
      value: p.key,
      label: p.label,
      badge: p.pricePerPerson > 0 ? `+${p.pricePerPerson} €/pers.` : "Inclus",
    }));
  }, [eventType]);

  return (
    <>
    <form
      ref={formRef}
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <input type="hidden" {...register("funnel_type")} value="festif" />
      <input type="hidden" {...register("source_page")} value="/festif" />

      <StepIndicator current={step} labels={FESTIF_STEP_LABELS} />

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
                    min={1}
                    max={34}
                    value={field.value ?? ""}
                    placeholder="—"
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      field.onChange(!isNaN(v) && v >= 1 ? Math.min(v, 34) : undefined);
                    }}
                    className="w-20 bg-transparent text-center font-serif text-5xl font-semibold leading-none text-ink outline-none placeholder:text-ink-subtle [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-subtle">
                    {field.value === 1 ? "personne" : "personnes"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    field.onChange(Math.min(34, (field.value ?? 0) + 1))
                  }
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

      {/* ── Étape 2 : Votre formule ── */}
      <div className={cn("flex flex-col gap-4", step !== 2 && "hidden")}>
        {/* festif_duration — cartes enrichies */}
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quelle durée souhaitez-vous ?
          </SectionQuestion>
          <Controller
            control={control}
            name="festif_duration"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {FESTIF_DURATION_CARDS.map((card) => {
                  const selected = field.value === card.value;
                  return (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => field.onChange(card.value)}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-[var(--radius-md)] border-2 px-4 py-3 text-left transition-all duration-150 cursor-pointer select-none active:scale-[0.99]",
                        selected
                          ? "border-accent bg-accent/[0.12] shadow-[0_0_22px_var(--card-glow)]"
                          : "border-line bg-surface-elevated hover:border-accent/50 hover:scale-[1.01]",
                      )}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-ink">{card.label}</span>
                        <span
                          className={cn(
                            "text-right text-xs font-bold leading-snug text-accent-strong sm:text-sm",
                            card.priceGolden && "price-golden-pulse",
                          )}
                        >
                          {card.priceHighlight}
                        </span>
                      </div>
                      {card.description && (
                        <span className="text-xs leading-relaxed text-ink-muted">
                          {card.description}
                        </span>
                      )}
                      {card.conditions && (
                        <span className="text-[10px] leading-relaxed text-ink-subtle">
                          {card.conditions}
                        </span>
                      )}
                      {card.note && (
                        <span className="text-[10px] italic leading-relaxed text-ink-subtle opacity-80">
                          {card.note}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.festif_duration && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.festif_duration.message}
            </p>
          )}
        </div>

        {/* Packs loisirs — conditionnel sur event_type */}
        {eventType && (
          <div className="flex flex-col gap-3">
            <SectionQuestion>
              Souhaitez-vous ajouter un pack loisirs ?
            </SectionQuestion>
            <p className="text-xs leading-relaxed text-ink-subtle">
              Piscine, sauna, tennis privé, city stade, basket, pétanque — inclus dans votre séjour.
            </p>
            <Controller
              control={control}
              name="loisirs_pack"
              render={({ field }) => (
                <RichCardSelect
                  options={loisirsPackOptions}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  cols={2}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* ── Étape 3 : Votre date ── */}
      <div className={cn("flex flex-col gap-4", step !== 3 && "hidden")}>
        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quelles sont vos dates envisagées ?
          </SectionQuestion>
          <Controller
            control={control}
            name="event_date"
            render={({ field }) => (
              <CalendarPicker
                multi
                value={field.value ? field.value.split(",").map((s) => s.trim()).filter(Boolean) : []}
                onChange={(dates) => field.onChange(dates.join(","))}
              />
            )}
          />
          {errors.event_date && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.event_date.message}
            </p>
          )}
        </div>

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

      {/* ── Étape 4 : Votre ambiance & options ── */}
      <div className={cn("flex flex-col gap-6", step !== 4 && "hidden")}>
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

        {/* Repas upgrade */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            {isSemaineOffer
              ? "Ajouter un petit-déjeuner ou un repas ?"
              : "Petit-déjeuner ou repas supplémentaire ?"}
          </SectionQuestion>
          <p className="text-xs leading-relaxed text-ink-subtle">
            {isSemaineOffer
              ? "Hébergement seul — petit-déjeuner en option."
              : "Petit-déjeuner essentiel déjà inclus."}
          </p>
          <Controller
            control={control}
            name="repas_upgrade"
            render={({ field }) => (
              <RichCardSelect
                options={[
                  {
                    value: "petit_dejeuner_continental",
                    label: FESTIF_REPAS_OPTIONS.petit_dejeuner_continental.label,
                    badge: `+${FESTIF_REPAS_OPTIONS.petit_dejeuner_continental.pricePerPerson} €/pers.`,
                  },
                  {
                    value: "brunch_sucre_sale",
                    label: FESTIF_REPAS_OPTIONS.brunch_sucre_sale.label,
                    badge: `+${FESTIF_REPAS_OPTIONS.brunch_sucre_sale.pricePerPerson} €/pers.`,
                  },
                  {
                    value: "brunch_complet",
                    label: FESTIF_REPAS_OPTIONS.brunch_complet.label,
                    badge: `+${FESTIF_REPAS_OPTIONS.brunch_complet.pricePerPerson} €/pers.`,
                  },
                  isSemaineOffer
                    ? {
                        value: "none",
                        label: "Hébergement seul",
                      }
                    : {
                        value: "none",
                        label: "Petit-déjeuner essentiel uniquement",
                        badge: "Inclus",
                      },
                ]}
                value={field.value}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
        </div>

        {/* Buffet traiteur / apéro */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Souhaitez-vous prévoir un repas traiteur ?
          </SectionQuestion>
          <p className="text-xs leading-relaxed text-ink-subtle">
            Boissons soft incluses, alcool non inclus.
          </p>
          <Controller
            control={control}
            name="buffet_choice"
            render={({ field }) => (
              <RichCardSelect
                options={[
                  {
                    value: "buffet_traiteur",
                    label: FESTIF_BUFFET_OPTIONS.buffet_traiteur.label,
                    badge: `+${FESTIF_BUFFET_OPTIONS.buffet_traiteur.pricePerPerson} €/pers.`,
                  },
                  {
                    value: "apero_dinatoire",
                    label: FESTIF_BUFFET_OPTIONS.apero_dinatoire.label,
                    badge: `+${FESTIF_BUFFET_OPTIONS.apero_dinatoire.pricePerPerson} €/pers.`,
                  },
                  { value: "none", label: "Pas pour le moment" },
                ]}
                value={field.value}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
          {buffetChoice && buffetChoice !== "none" && (
            <FormField
              id="f-dietary-notes"
              label="Précisez votre demande"
              required
              hint="Indiquez vos préférences alimentaires pour que l'équipe puisse vous orienter rapidement."
              error={errors.dietary_notes?.message}
            >
              <textarea
                rows={3}
                className={fieldBaseClass}
                placeholder="Halal, végétarien, allergies, gâteau, barbecue, chef à domicile, repas chaud, autre besoin…"
                {...register("dietary_notes")}
              />
            </FormField>
          )}
        </div>

        {/* Service courses */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Souhaitez-vous gagner du temps avant votre arrivée ?
          </SectionQuestion>
          <Controller
            control={control}
            name="service_courses"
            render={({ field }) => (
              <RichCardSelect
                options={[
                  {
                    value: "service_courses",
                    label: FESTIF_SERVICE_COURSES.label,
                    badge: `${FESTIF_SERVICE_COURSES.priceFlatRate} €`,
                  },
                  { value: "none", label: "Pas pour le moment" },
                  { value: "plus_tard", label: "Je préciserai plus tard" },
                ]}
                value={field.value}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
        </div>

        {/* Intervenants */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Souhaitez-vous ajouter un intervenant ?
          </SectionQuestion>
          <p className="text-xs leading-relaxed text-ink-subtle">
            Proposés en supplément, selon disponibilité des partenaires.
          </p>
          <Controller
            control={control}
            name="intervenants"
            render={({ field }) => (
              <RichMultiCardSelect
                options={[
                  {
                    value: "dj_son_lumiere",
                    label: FESTIF_INTERVENANTS.dj_son_lumiere.label,
                    badge: `${FESTIF_INTERVENANTS.dj_son_lumiere.priceFlat} €`,
                  },
                  {
                    value: "bien_etre_energie",
                    label: FESTIF_INTERVENANTS.bien_etre_energie.label,
                    badge: `${FESTIF_INTERVENANTS.bien_etre_energie.priceFlat} €`,
                  },
                  {
                    value: "cracheur_de_feu",
                    label: FESTIF_INTERVENANTS.cracheur_de_feu.label,
                    badge: `${FESTIF_INTERVENANTS.cracheur_de_feu.priceFlat} €`,
                  },
                  {
                    value: "echassier_lumineux",
                    label: FESTIF_INTERVENANTS.echassier_lumineux.label,
                    badge: `${FESTIF_INTERVENANTS.echassier_lumineux.priceFlat} €`,
                  },
                  {
                    value: "animation_adulte",
                    label: FESTIF_INTERVENANTS.animation_adulte.label,
                    badge: "Sur demande",
                  },
                ]}
                value={field.value ?? []}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
          <FormField
            id="f-autre-intervenant"
            label="Autre intervenant souhaité (facultatif)"
          >
            <textarea
              rows={1}
              className={fieldBaseClass}
              placeholder="Décrivez l'intervenant souhaité…"
              {...register("autre_intervenant_notes")}
            />
          </FormField>
        </div>

        {/* Matériel complémentaire */}
        <div className="flex flex-col gap-3">
          <SectionQuestion>
            Avez-vous besoin de matériel complémentaire ?
          </SectionQuestion>
          <Controller
            control={control}
            name="materiel"
            render={({ field }) => (
              <RichMultiCardSelect
                options={[
                  {
                    value: "tente_barnum",
                    label: FESTIF_MATERIEL.tente_barnum.label,
                    badge: `${FESTIF_MATERIEL.tente_barnum.priceFlat} €`,
                  },
                  {
                    value: "tables_chaises",
                    label: FESTIF_MATERIEL.tables_chaises.label,
                    badge: `${FESTIF_MATERIEL.tables_chaises.priceFlat} €`,
                  },
                ]}
                value={field.value ?? []}
                onChange={field.onChange}
                cols={2}
              />
            )}
          />
          <FormField
            id="f-autre-materiel"
            label="Autre besoin matériel (facultatif)"
          >
            <textarea
              rows={1}
              className={fieldBaseClass}
              placeholder="Décrivez votre besoin…"
              {...register("autre_materiel_notes")}
            />
          </FormField>
        </div>

        {/* Activités partenaires */}
        <div className="flex flex-col gap-3">
          <div>
            <SectionQuestion>
              Souhaitez-vous des activités avec nos partenaires ?
            </SectionQuestion>
            <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
              Extras hors devis — notre équipe vous recontacte.
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
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                          <span
                            className={cn(
                              "relative size-9 shrink-0 overflow-hidden rounded-full border-2",
                              isSelected
                                ? "border-accent shadow-[0_0_14px_var(--card-glow)]"
                                : "border-line",
                            )}
                          >
                            <Image
                              src={`/images/festif/icons/${act.id}.jpg`}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
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

        {/* Cadeau offert — conditionnel */}
        {quote?.cadeauEligible && (
          <div className="rounded-[var(--radius-md)] border border-accent/40 bg-accent/[0.06] p-4">
            <p className="mb-1 font-serif text-base font-medium text-ink">
              Un cadeau vous est offert
            </p>
            <p className="mb-3 text-xs leading-relaxed text-ink-muted">
              Votre groupe est éligible à un cadeau de réservation.
            </p>
            <Controller
              control={control}
              name="cadeau_choice"
              render={({ field }) => (
                <RichCardSelect
                  options={FESTIF_CADEAU_OPTIONS.map((c) => ({
                    value: c.key,
                    label: c.label,
                  }))}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="mt-3 text-[10px] leading-relaxed text-ink-subtle opacity-70">
              Un seul cadeau par réservation · non cumulable, ni remboursable,
              ni échangeable · confirmé après acompte reçu · selon disponibilité.
            </p>
          </div>
        )}

        {festifDuration === "semaine_1_nuit" && !quote?.cadeauEligible && (
          <p className="text-xs leading-relaxed text-ink-subtle opacity-60">
            Cadeau de réservation disponible selon nombre de participants et validation commerciale.
          </p>
        )}

        {/* Estimation indicative — total en direct (détail sur /confirmation) */}
        <QuotePreview quote={quote} guestCount={guestCount} compact />
      </div>

      {/* ── Étape 5 : Budget & timing ── */}
      <div className={cn("flex flex-col gap-3", step !== 5 && "hidden")}>
        {/* Rappel estimation (résumé — détail complet sur /confirmation) */}
        <QuotePreview quote={quote} guestCount={guestCount} compact />

        <div className="flex flex-col gap-3">
          <SectionQuestion required>
            Quel budget visez-vous pour l&apos;événement ?
          </SectionQuestion>
          <Controller
            control={control}
            name="budget_range"
            render={({ field }) => (
              <CardSelect
                options={budgetRangeOptions}
                value={field.value}
                onChange={field.onChange}
                cols={3}
              />
            )}
          />
          {errors.budget_range && (
            <p key={validationAttempt} role="alert" className="animate-fade-in-up text-xs leading-relaxed text-accent-strong">
              {errors.budget_range.message}
            </p>
          )}
        </div>

        <FormField
          id="f-message"
          label="Un message à ajouter ?"
          error={errors.message?.message}
        >
          <textarea
            rows={2}
            className={fieldBaseClass}
            placeholder="Partagez votre idée, l'ambiance recherchée ou tout point important."
            {...register("message")}
          />
        </FormField>
      </div>

      {/* ── Navigation ── */}
      <div className="flex flex-col gap-3 pt-1">
        {serverError && (
          <p
            role="alert"
            className="rounded-[var(--radius-md)] border border-accent-strong/50 bg-accent-strong/10 px-4 py-3 text-sm text-accent-strong"
          >
            {serverError}
          </p>
        )}
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
              {isPending ? "Envoi en cours..." : "Recevoir mon devis personnalisé →"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                size="md"
                variant="secondary"
                onClick={() => { scrollToForm(); setStep(1); }}
                className="h-auto min-h-10 w-full whitespace-normal"
              >
                Modifier mes choix
              </Button>
              <Button
                type="button"
                size="md"
                variant="ghost"
                onClick={() => { scrollToForm(); setStep(LAST_OPTIONS_STEP); }}
                className="h-auto min-h-10 w-full whitespace-normal"
              >
                Ajouter une option
              </Button>
            </div>
            <p className="text-center text-xs leading-relaxed text-ink-subtle">
              Réponse sous 24h · sous réserve de disponibilité et validation finale.
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

    {/* Hors du <form> : le modal contient son propre formulaire. */}
    <ContactGateModal
      open={gateOpen}
      sourcePage="/festif"
      ctaLabel="Reprendre ma demande →"
      onSubmitted={handleGateSubmitted}
    />
    </>
  );
}
