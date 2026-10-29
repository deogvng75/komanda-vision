export type Tone = "Amical" | "Professionnel" | "Direct";
export type Currency = "CDF" | "USD";
export type Language = "fr" | "en";

export type Settings = {
  // Boutique
  shopName: string;
  ownerName: string;
  phone: string;
  currency: Currency;
  language: Language;
  // Notifications
  notifyOrders: boolean;
  notifyPayments: boolean;
  notifyStock: boolean;
  dailySummary: boolean;
  // Copilote
  tone: Tone;
  autoReply: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  shopName: "Ma boutique",
  ownerName: "",
  phone: "",
  currency: "CDF",
  language: "fr",
  notifyOrders: true,
  notifyPayments: true,
  notifyStock: true,
  dailySummary: false,
  tone: "Amical",
  autoReply: false,
};

const STORAGE_KEY = "komanda:settings";
export const SETTINGS_CHANGE_EVENT = "komanda:settings-changed";

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Prévient la barre latérale et les autres composants qu'il faut se mettre à jour.
    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  } catch {
    // Stockage indisponible (navigation privée, quota) : on ignore.
  }
}
