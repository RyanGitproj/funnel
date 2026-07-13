"use client";

import * as React from "react";
import { ContactGateModal } from "./ContactGateModal";

/**
 * Gate d'entrée des pages d'atterrissage (/, /ceremonie, /festif) :
 * ouvert tant que le visiteur n'a pas de contact enregistré — y compris
 * quand une pub envoie directement sur un univers. La décision vient du
 * serveur (cookie httpOnly lu dans la page, passé via `initialOpen`).
 */
export function ContactGate({
  initialOpen,
  sourcePage,
}: {
  initialOpen: boolean;
  sourcePage: string;
}) {
  const [open, setOpen] = React.useState(initialOpen);

  return (
    <ContactGateModal
      open={open}
      sourcePage={sourcePage}
      onSubmitted={() => setOpen(false)}
    />
  );
}
