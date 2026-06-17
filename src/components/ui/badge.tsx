import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — pastille de label premium (eyebrow, tag, etc.).
 *
 * Utilisé pour les bandeaux « DOMAINE DES ÉLÉGANCES » au-dessus des
 * titres, les catégories, etc. Coins légèrement arrondis, lettres
 * majuscules très espacées — pas un chip arrondi façon app mobile.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "font-sans font-medium uppercase tracking-[0.18em]",
    "whitespace-nowrap shrink-0",
    "border px-3 py-1 text-[0.68rem]",
    "rounded-[var(--radius-sm)]",
    "transition-colors",
    "[&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
  ].join(" "),
  {
    variants: {
      variant: {
        // Eyebrow par défaut : doré sur fond transparent, bordure dorée fine
        accent:
          "border-accent/60 text-accent-strong bg-accent/5",
        // Sur surface : texte ink-muted, bordure line
        muted:
          "border-line text-ink-muted bg-surface-alt",
        // Sur accent : fond doré plein
        solid:
          "border-transparent bg-accent-strong text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "accent",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
