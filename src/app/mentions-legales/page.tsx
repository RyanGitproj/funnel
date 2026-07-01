import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalSection } from "@/components/layout/LegalSection";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Domaine des Élégances — éditeur du site et hébergement.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
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
              Mentions légales
            </h1>

            <LegalSection title="Éditeur du site">
              <p>
                Le présent site est édité par la société <strong>LIEUX DE
                CELEBRATIONS.COM</strong>, Société par actions simplifiée
                (SAS) au capital social de 200 €.
              </p>
              <p>
                Siège social : 60 rue François Ier, 75008 Paris, France
                <br />
                RCS Paris : 990 106 098
              </p>
              <p>
                Directeur de la publication : Monsieur Ludwig Laurent
                Thomas, Président de la société.
              </p>
              <p>
                Contact : 07 88 80 81 94 —{" "}
                <a
                  href="mailto:contact@domainedeselegances.fr"
                  className="text-accent-strong underline underline-offset-2"
                >
                  contact@domainedeselegances.fr
                </a>
              </p>
            </LegalSection>

            <LegalSection title="Hébergement">
              <p>
                Le site est hébergé par :
                <br />
                Render Services, Inc.
                <br />
                525 Brannan Street, Suite 300
                <br />
                San Francisco, CA 94107, États-Unis
                <br />
                <a
                  href="https://render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-strong underline underline-offset-2"
                >
                  render.com
                </a>
              </p>
            </LegalSection>
          </div>
        </section>
      </main>

      <Footer />
    </ThemeProvider>
  );
}
