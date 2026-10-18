import { useEffect, useState } from "react";

export type NotificationType = "Commande" | "Stock" | "Paiement";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  detailsTo?: string;
};

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "Commande",
    title: "Nouvelle commande reçue",
    message: "La commande #1052 de Sarah M. (Robe Élégance, 28 000 CDF) vient d'arriver.",
    time: "Il y a 5 min",
    unread: true,
    detailsTo: "/commandes",
  },
  {
    id: "n2",
    type: "Stock",
    title: "Stock faible",
    message: "Sneakers Classic : il ne reste que 3 unités.",
    time: "Il y a 30 min",
    unread: true,
    detailsTo: "/produits",
  },
  {
    id: "n3",
    type: "Paiement",
    title: "Paiement reçu avec succès",
    message: "Paiement de 60 000 CDF reçu pour la commande #1051.",
    time: "Il y a 1 h",
    unread: true,
    detailsTo: "/ventes",
  },
  {
    id: "n4",
    type: "Commande",
    title: "Commande confirmée",
    message: "La commande #1052 de Sarah M. a été confirmée.",
    time: "Il y a 2 h",
    unread: true,
    detailsTo: "/commandes",
  },
  {
    id: "n5",
    type: "Paiement",
    title: "Paiement en attente",
    message: "Le paiement de 35 000 CDF pour la commande #1049 (Alice P.) est en attente.",
    time: "Il y a 3 h",
    unread: true,
    detailsTo: "/ventes",
  },
  {
    id: "n6",
    type: "Commande",
    title: "Commande expédiée",
    message: "La commande #1051 de David K. (Sneakers Classic) est en cours de livraison.",
    time: "Il y a 5 h",
    unread: false,
    detailsTo: "/commandes",
  },
  {
    id: "n7",
    type: "Stock",
    title: "Produit bientôt en rupture",
    message: "Montre Prestige : il ne reste que 4 unités (seuil d'alerte atteint).",
    time: "Il y a 8 h",
    unread: false,
    detailsTo: "/produits",
  },
  {
    id: "n8",
    type: "Commande",
    title: "Commande livrée",
    message: "La commande #1050 de Marie L. (Sac Milano) a été livrée.",
    time: "Hier",
    unread: false,
    detailsTo: "/commandes",
  },
  {
    id: "n9",
    type: "Stock",
    title: "Produit en rupture de stock",
    message: "Parfum Signature : le stock est épuisé. Pensez à le réapprovisionner.",
    time: "Hier",
    unread: false,
    detailsTo: "/produits",
  },
  {
    id: "n10",
    type: "Paiement",
    title: "Paiement échoué",
    message: "Le paiement de 45 000 CDF pour la commande #1050 a échoué. Nouvelle tentative effectuée.",
    time: "Hier",
    unread: false,
    detailsTo: "/ventes",
  },
];

const STORAGE_KEY = "komanda-notifications";

type StoredReadState = { id: string; unread: boolean };

function isValidStoredState(value: unknown): value is StoredReadState[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as StoredReadState).id === "string" &&
        typeof (item as StoredReadState).unread === "boolean",
    )
  );
}

export function loadNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATIONS;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidStoredState(parsed)) return DEFAULT_NOTIFICATIONS;
    const stateById = new Map(parsed.map((s) => [s.id, s.unread]));
    return DEFAULT_NOTIFICATIONS.map((n) =>
      stateById.has(n.id) ? { ...n, unread: stateById.get(n.id)! } : n,
    );
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: NotificationItem[]) {
  if (typeof window === "undefined") return;
  try {
    const state: StoredReadState[] = notifications.map(({ id, unread }) => ({ id, unread }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Stockage local indisponible : on ignore silencieusement.
  }
}

export function getUnreadCount(): number {
  return loadNotifications().filter((n) => n.unread).length;
}

/** Compteur de notifications non lues, lu côté client après hydratation. */
export function useUnreadNotifications(): number {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    setUnread(getUnreadCount());
  }, []);
  return unread;
}
