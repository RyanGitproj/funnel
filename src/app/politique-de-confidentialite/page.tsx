import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalSection } from "@/components/layout/LegalSection";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site Domaine des Élégances — données collectées, finalités, durée de conservation, droits RGPD.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <ThemeProvider
      theme="accueil"
      as="div"
      className="flex min-h-screen flex-col bg-surface"
    >
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <h1 className="font-serif text-4xl font-semibold leading-[1.12] text-ink md:text-5xl">
              Politique de confidentialité
            </h1>

            <LegalSection title="Responsable du traitement">
              <p>
                Les données personnelles collectées sur ce site sont
                traitées par <strong>LIEUX DE CELEBRATIONS.COM</strong>,
                Société par actions simplifiée (SAS) dont le siège social
                est situé 60 rue François Ier, 75008 Paris, France.
              </p>
            </LegalSection>

            <LegalSection title="Finalités du traitement">
              <ul className="list-disc space-y-2 pl-5">
                <li>Traiter votre demande de devis et vous recontacter</li>
                <li>
                  Assurer le suivi de votre projet d&rsquo;événement jusqu&rsquo;à
                  sa réalisation
                </li>
                <li>
                  Mesurer l&rsquo;audience du site (Google Analytics), uniquement
                  après votre consentement
                </li>
                <li>
                  Mesurer la performance de nos campagnes publicitaires (Meta
                  Pixel, suivi des conversions Google Ads), uniquement après
                  votre consentement
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="Base légale">
              <p>
                Le traitement de votre demande de devis repose sur
                l&rsquo;exécution de mesures précontractuelles prises à votre
                demande. Le dépôt de cookies de mesure d&rsquo;audience et de
                performance publicitaire repose sur votre consentement,
                recueilli via le bandeau affiché lors de votre première
                visite.
              </p>
            </LegalSection>

            <LegalSection title="Durée de conservation">
              <p>
                Les données des prospects sont conservées pendant une durée
                maximale de 3 ans à compter de leur collecte ou du dernier
                contact émanant du prospect. Au-delà, elles sont supprimées
                ou anonymisées, sauf obligation légale contraire.
              </p>
              <p>
                Pour les clients, les données sont conservées pendant la
                durée de la relation commerciale, puis jusqu&rsquo;à 3 ans à
                compter de la fin de cette relation à des fins commerciales.
              </p>
            </LegalSection>

            <LegalSection title="Destinataires des données">
              <p>
                Vos données sont accessibles à l&rsquo;équipe de LIEUX DE
                CELEBRATIONS.COM, ainsi qu&rsquo;à nos sous-traitants
                techniques : Render (hébergement du site), Supabase
                (hébergement de la base de données), Google (Google Tag
                Manager / Google Analytics / suivi des conversions Google
                Ads, sous réserve de votre consentement) et Meta Platforms
                (Meta Pixel, sous réserve de votre consentement).
              </p>
            </LegalSection>

            <LegalSection title="Transferts hors Union européenne">
              <p>
                Certains de nos sous-traitants (notamment Google, Meta et
                Render) sont susceptibles de traiter des données en dehors de
                l&rsquo;Union européenne, notamment aux États-Unis. Ces
                transferts sont encadrés par des garanties appropriées,
                telles que les clauses contractuelles types de la Commission
                européenne.
              </p>
            </LegalSection>

            <LegalSection title="Cookies">
              <p>
                Ce site utilise des cookies de mesure d&rsquo;audience (Google
                Analytics) et de performance publicitaire (Meta Pixel, suivi
                des conversions Google Ads) uniquement après recueil de votre
                consentement, via le bandeau affiché lors de votre première
                visite. Vous
                pouvez à tout moment revenir sur votre choix en effaçant les
                données de navigation stockées par votre navigateur pour ce
                site.
              </p>
            </LegalSection>

            <LegalSection title="Vos droits">
              <p>
                Conformément au Règlement Général sur la Protection des
                Données (RGPD), vous disposez d&rsquo;un droit d&rsquo;accès,
                de rectification, d&rsquo;effacement, de limitation,
                d&rsquo;opposition et de portabilité de vos données
                personnelles.
              </p>
              <p>
                Pour exercer ces droits, contactez-nous à{" "}
                <a
                  href="mailto:contact@domainedeselegances.fr"
                  className="text-accent-strong underline underline-offset-2"
                >
                  contact@domainedeselegances.fr
                </a>
                . Vous disposez également du droit d&rsquo;introduire une
                réclamation auprès de la{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-strong underline underline-offset-2"
                >
                  CNIL
                </a>
                .
              </p>
            </LegalSection>
          </div>
        </section>
      </main>

      <Footer />
    </ThemeProvider>
  );
}
