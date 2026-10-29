import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Database, Download, RotateCcw, Sparkles, Store, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppShell } from "../components/AppShell";
import { clearAllData, exportBackup, importBackup } from "../lib/backup";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type Settings,
  type Tone,
} from "../lib/settings";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres | KOMANDA" },
      {
        name: "description",
        content: "Gérez votre boutique, vos notifications et votre copilote KOMANDA.",
      },
      { property: "og:title", content: "Paramètres | KOMANDA" },
      {
        property: "og:description",
        content: "Gérez votre boutique, vos notifications et votre copilote KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const tones: Tone[] = ["Amical", "Professionnel", "Direct"];

const toneExamples: Record<Tone, string> = {
  Amical: "Bonjour Sarah ! Votre commande est bien confirmée, on vous la prépare tout de suite.",
  Professionnel: "Bonjour Sarah, votre commande est confirmée. Elle sera préparée dans les plus brefs délais.",
  Direct: "Commande confirmée. Préparation en cours.",
};

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
        checked ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-card shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Store;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="size-4" strokeWidth={1.8} />
      </span>
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [justSaved, setJustSaved] = useState(false);
  const [dataMessage, setDataMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Restaure les paramètres enregistrés localement après hydratation.
  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    setSavedSettings(stored);
  }, []);

  // Fait disparaître le message de confirmation au bout de quelques secondes.
  useEffect(() => {
    if (!justSaved) return;
    const timer = window.setTimeout(() => setJustSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [justSaved]);

  const dirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setJustSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSavedSettings(settings);
    setJustSaved(true);
  };

  const handleReset = () => {
    setJustSaved(false);
    setSettings(DEFAULT_SETTINGS);
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    if (!window.confirm("Importer cette sauvegarde ? Elle remplacera les données actuelles de cet appareil.")) {
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    try {
      await importBackup(file);
      window.location.reload();
    } catch (error) {
      setDataMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "Impossible d'importer ce fichier.",
      });
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleClear = () => {
    if (
      !window.confirm(
        "Supprimer toutes les données (produits, clients, commandes, notifications et paramètres) ? Cette action est définitive. Pensez à exporter une sauvegarde avant.",
      )
    ) {
      return;
    }
    clearAllData();
    window.location.reload();
  };

  return (
    <AppShell active="parametres">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold leading-tight sm:text-[36px]">Paramètres</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez votre boutique, vos alertes et la façon dont le copilote parle à vos clients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleReset} className={secondaryButton}>
            <RotateCcw className="size-4" />
            Rétablir
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enregistrer les modifications
          </button>
        </div>
      </header>

      {justSaved && (
        <p
          role="status"
          className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-success"
        >
          <Check className="size-3.5" />
          Modifications enregistrées
        </p>
      )}

      <div className="max-w-3xl space-y-3.5">
        <section className="content-card">
          <SectionHeader
            icon={Store}
            title="Ma boutique"
            description="Ces informations apparaissent dans la barre latérale et sur votre tableau de bord."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="shop-name" label="Nom de la boutique">
              <input
                id="shop-name"
                type="text"
                value={settings.shopName}
                onChange={(e) => update("shopName", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="owner-name" label="Nom du responsable">
              <input
                id="owner-name"
                type="text"
                value={settings.ownerName}
                onChange={(e) => update("ownerName", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="phone" label="Téléphone">
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="+243 8X XXX XXXX"
                value={settings.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="currency" label="Devise">
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => update("currency", e.target.value as Settings["currency"])}
                  className={inputClass}
                >
                  <option value="CDF">CDF</option>
                  <option value="USD">USD</option>
                </select>
              </Field>
              <Field id="language" label="Langue">
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => update("language", e.target.value as Settings["language"])}
                  className={inputClass}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </Field>
            </div>
          </div>
        </section>

        <section className="content-card">
          <SectionHeader
            icon={Bell}
            title="Notifications"
            description="Choisissez ce qui mérite une alerte. Les alertes sont créées quand vous enregistrez une commande ou un paiement."
          />
          <div className="divide-y divide-border/70">
            <SettingRow title="Nouvelles commandes" description="Soyez prévenu dès qu'une commande est enregistrée.">
              <Toggle
                label="Nouvelles commandes"
                checked={settings.notifyOrders}
                onChange={(v) => update("notifyOrders", v)}
              />
            </SettingRow>
            <SettingRow title="Paiements reçus" description="Une alerte à chaque commande marquée comme payée.">
              <Toggle
                label="Paiements reçus"
                checked={settings.notifyPayments}
                onChange={(v) => update("notifyPayments", v)}
              />
            </SettingRow>
            <SettingRow title="Stock bas" description="Recevez un avertissement avant la rupture d'un produit.">
              <Toggle
                label="Stock bas"
                checked={settings.notifyStock}
                onChange={(v) => update("notifyStock", v)}
              />
            </SettingRow>
            <SettingRow title="Résumé du soir" description="Un récapitulatif de vos ventes de la journée (bientôt disponible).">
              <Toggle
                label="Résumé du soir"
                checked={settings.dailySummary}
                onChange={(v) => update("dailySummary", v)}
              />
            </SettingRow>
          </div>
        </section>

        <section className="content-card">
          <SectionHeader
            icon={Sparkles}
            title="Copilote"
            description="Réglez le ton des messages que le copilote préparera pour vous."
          />
          <div role="group" aria-label="Ton des messages" className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => update("tone", tone)}
                aria-pressed={settings.tone === tone}
                className={
                  settings.tone === tone
                    ? "rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                    : "rounded-full border border-input bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                }
              >
                {tone}
              </button>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-muted/70 p-3 text-sm text-muted-foreground">
            {toneExamples[settings.tone]}
          </p>
          <div className="mt-2 divide-y divide-border/70">
            <SettingRow
              title="Répondre automatiquement aux clients"
              description="Le copilote répondra aux questions simples (prix, disponibilité). Bientôt disponible."
            >
              <Toggle
                label="Répondre automatiquement aux clients"
                checked={settings.autoReply}
                onChange={(v) => update("autoReply", v)}
              />
            </SettingRow>
          </div>
        </section>

        <section className="content-card">
          <SectionHeader
            icon={Database}
            title="Mes données"
            description="Vos données sont enregistrées dans ce navigateur, sur cet appareil. Faites une sauvegarde régulière."
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                exportBackup();
                setDataMessage({ kind: "ok", text: "Sauvegarde téléchargée." });
              }}
              className={secondaryButton}
            >
              <Download className="size-4" />
              Exporter une sauvegarde
            </button>
            <button type="button" onClick={() => fileInput.current?.click()} className={secondaryButton}>
              <Upload className="size-4" />
              Importer une sauvegarde
            </button>
            <button type="button" onClick={handleClear} className={secondaryButton}>
              <Trash2 className="size-4" />
              Tout effacer
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => handleImport(e.target.files?.[0])}
            />
          </div>
          {dataMessage && (
            <p
              role={dataMessage.kind === "error" ? "alert" : "status"}
              className={`mt-3 text-sm font-medium ${dataMessage.kind === "error" ? "text-warning" : "text-success"}`}
            >
              {dataMessage.text}
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
