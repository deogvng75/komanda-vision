import { useEffect, useState } from "react";
import { loadSettings, type Settings } from "./settings";

export type NotificationType = "Commande" | "Stock" | "Paiement";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  detailsTo?: "/commandes" | "/clients" | "/produits" | "/ventes";
};

// Liste vide au départ : les notifications sont créées par l'activité réelle de la boutique.
export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

const STORAGE_KEY = "komanda:notifications";
const CHANGE_EVENT = "komanda:notifications-changed";
const MAX_NOTIFICATIONS = 50;

export function loadNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATIONS;
    const parsed = JSON.parse(raw) as NotificationItem[];
    return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveNotifications(items: NotificationItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Prévient les autres composants (sidebar, autres pages) qu'il y a eu un changement.
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Stockage indisponible (navigation privée, quota) : on ignore.
  }
}

const SETTING_FOR_TYPE: Record<NotificationType, keyof Settings> = {
  Commande: "notifyOrders",
  Paiement: "notifyPayments",
  Stock: "notifyStock",
};

/**
 * Ajoute une notification en tête de liste, si le type est activé dans les Paramètres.
 */
export function pushNotification(input: Omit<NotificationItem, "id" | "time" | "unread">) {
  if (typeof window === "undefined") return;
  if (!loadSettings()[SETTING_FOR_TYPE[input.type]]) return;

  const item: NotificationItem = {
    ...input,
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    time: new Date().toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    unread: true,
  };
  saveNotifications([item, ...loadNotifications()].slice(0, MAX_NOTIFICATIONS));
}

/** Nombre de notifications non lues, mis à jour quand l'état change. */
export function useUnreadNotifications(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(loadNotifications().filter((n) => n.unread).length);
    refresh();
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return count;
}
