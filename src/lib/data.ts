import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, loadSettings, SETTINGS_CHANGE_EVENT, type Settings } from "./settings";
import { useStoredList } from "./store";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
};

export type OrderStatus =
  | "Nouvelle"
  | "Confirmée"
  | "En préparation"
  | "En livraison"
  | "Livrée"
  | "Annulée";

export type PaymentStatus = "Payée" | "En attente";

export type Order = {
  id: string;
  number: number;
  clientId: string;
  clientName: string;
  productId: string;
  productName: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  address: string;
  createdAt: string;
};

export const STORAGE_KEYS = {
  products: "komanda:products",
  clients: "komanda:clients",
  orders: "komanda:orders",
} as const;

export const useProducts = () => useStoredList<Product>(STORAGE_KEYS.products);
export const useClients = () => useStoredList<Client>(STORAGE_KEYS.clients);
export const useOrders = () => useStoredList<Order>(STORAGE_KEYS.orders);

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function formatMoney(value: number, currency: string = "CDF"): string {
  return `${value.toLocaleString("fr-FR")} ${currency}`;
}

export type StockStatus = "En stock" | "Stock bas" | "Rupture";

export function stockStatus(product: Product): StockStatus {
  if (product.stock <= 0) return "Rupture";
  if (product.stock <= product.lowStockThreshold) return "Stock bas";
  return "En stock";
}

export function stockTone(status: StockStatus): "success" | "warning" | "danger" {
  if (status === "Rupture") return "danger";
  if (status === "Stock bas") return "warning";
  return "success";
}

/** Paramètres de la boutique (nom, devise...), lus après hydratation. */
export function useSettingsSnapshot(): Settings {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  useEffect(() => {
    const refresh = () => setSettings(loadSettings());
    refresh();
    window.addEventListener(SETTINGS_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SETTINGS_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return settings;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "Nouvelle",
  "Confirmée",
  "En préparation",
  "En livraison",
  "Livrée",
  "Annulée",
];

export const PAYMENT_METHODS = ["Espèces", "Mobile Money", "Carte bancaire", "Virement"] as const;

export function orderStatusTone(
  status: OrderStatus,
): "success" | "info" | "neutral" | "warning" | "danger" {
  switch (status) {
    case "Confirmée":
      return "success";
    case "En préparation":
    case "En livraison":
      return "info";
    case "Livrée":
      return "neutral";
    case "Nouvelle":
      return "warning";
    case "Annulée":
      return "danger";
  }
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Début de la journée (minuit, heure locale) de la date donnée, en millisecondes. */
export function startOfDay(value: number | Date): number {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
