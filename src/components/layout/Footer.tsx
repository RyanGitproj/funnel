import Link from "next/link";

/**
 * Footer — minimal, premium, agnostique du thème.
 *
 * Conformément au brief J1 : « logo, mention légale minimale, contact ».
 * On n'ajoute ni newsletter, ni liens vers des réseaux sociaux (hors
 * périmètre aujourd'hui — à ajouter dans une itération ultérieure).
 */

const currentYear = new Date().getFullYear();

const defaultDescription =
  "Un lieu d'exception pour célébrer les moments qui comptent. Mariages, enterrements de vie de jeune fille ou de garçon, anniversaires — deux univers, une même exigence d'élégance.";

export function Footer({ description = defaultDescription }: { description?: string }) {
  return (
    <footer id="contact" className="mt-auto border-t border-line bg-surface-alt">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Bloc identité */}
          <div className="space-y-3">
            <div className="flex flex-col leading-none">
              <span
                className="text-eyebrow text-ink"
                style={{ letterSpacing: "0.22em" }}
              >
                Domaine
              </span>
              <span
                className="text-eyebrow text-accent-strong mt-1"
                style={{ letterSpacing: "0.32em" }}
              >
                DES ÉLÉGANCES
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              {description}
            </p>
          </div>

          {/* Bloc navigation */}
          <div className="space-y-3">
            <h3 className="text-eyebrow">Parcours</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ceremonie"
                  className="text-ink-muted transition-colors hover:text-accent-strong"
                >
                  Cérémonie & mariages
                </Link>
              </li>
              <li>
                <Link
                  href="/festif"
                  className="text-ink-muted transition-colors hover:text-accent-strong"
                >
                  Festif — enterrements de vie / anniversaires
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-ink-muted transition-colors hover:text-accent-strong"
                >
                  Accueil
                </Link>
              </li>
            </ul>
          </div>

          {/* Bloc contact */}
          <div className="space-y-3">
            <h3 className="text-eyebrow">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-ink-muted">
                <a
                  href="tel:+33000000000"
                  className="transition-colors hover:text-accent-strong"
                >
                  +33 (0)0 00 00 00 00
                </a>
              </li>
              <li className="text-ink-muted">
                <a
                  href="mailto:contact@domainedeselegances.fr"
                  className="transition-colors hover:text-accent-strong"
                >
                  contact@domainedeselegances.fr
                </a>
              </li>
              <li className="text-ink-muted">
                Réponse sous 24h ouvrées
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-ink-subtle sm:flex-row sm:items-center">
          <p>
            © {currentYear} Domaine des Élégances. Tous droits réservés.
          </p>
          <p className="flex gap-4">
            <span>Mentions légales</span>
            <span>·</span>
            <span>Politique de confidentialité</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
