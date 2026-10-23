import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Globe,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import marieAvatar from "../assets/marie-avatar.jpg";
import { useUnreadNotifications } from "../lib/notifications";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres | KOMANDA" },
      {
        name: "description",
        content: "Gérez votre boutique et vos préférences avec KOMANDA.",
      },
      { property: "og:title", content: "Paramètres | KOMANDA" },
      {
        property: "og:description",
        content: "Gérez votre boutique et vos préférences avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ParametresPage,
});

type NavItem = {
  label: string;
  icon: typeof Gauge;
  active?: boolean;
  to?: string;
};

type ToggleRow = {
  id: string;
  label: string;
  description: string;
};

const notificationPreferences: ToggleRow[] = [
  { id: "new-orders", label: "Nouvelles commandes", description: "Être notifiée dès qu'une commande est reçue." },
  { id: "low-stock", label: "Alertes de stock", description: "Être prévenue quand un produit est bientôt en rupture." },
  { id: "payments", label: "Paiements reçus", description: "Être notifiée à chaque paiement confirmé." },
  { id: "weekly-summary", label: "Résumé hebdomadaire", description: "Un récapitulatif de vos ventes chaque lundi." },
];

const shopFields = [
  { id: "name", label: "Nom de la boutique", value: "Boutique Marie" },
  { id: "owner", label: "Nom du propriétaire", value: "Marie D." },
  { id: "phone", label: "Téléphone", value: "+243 810 000 000" },
  { id: "email", label: "Email", value: "marie@boutiquemarie.com" },
  { id: "address", label: "Adresse", value: "Kinshasa, Gombe" },
];

const preferenceOptions: Record<string, string[]> = {
  Devise: ["CDF — Franc congolais"],
  Langue: ["Français"],
  "Fuseau horaire": ["Kinshasa (UTC+1)"],
};

const securityItems = [
  { id: "password", label: "Mot de passe", description: "Dernière modification il y a 3 mois", action: "Modifier" },
  { id: "sessions", label: "Sessions actives", description: "2 appareils connectés", action: "Gérer" },
  { id: "delete", label: "Supprimer la boutique", description: "Cette action est irréversible", action: "Supprimer" },
];

function BrandMark() {
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-brand">
      K
    </div>
  );
}

function Sidebar({ notificationsBadge }: { notificationsBadge?: number | undefined }) {
  const navigation: NavItem[] = [
    { label: "Dashboard", icon: Gauge, to: "/" },
    { label: "Commandes", icon: ClipboardList, to: "/commandes", badge: 12 },
    { label: "Clients", icon: Users, to: "/clients" },
    { label: "Produits", icon: Package, to: "/produits" },
    { label: "Ventes", icon: TrendingUp, to: "/ventes" },
    { label: "Notifications", icon: Bell, to: "/notifications" },
    { label: "Paramètres", icon: Settings, active: true, to: "/parametres" },
  ];
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/70 bg-sidebar/72 px-5 py-6 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2.5 px-1">
        <BrandMark />
        <div>
          <p className="font-display text-[15px] font-semibold leading-none">KOMANDA</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Le copilote commercial</p>
        </div>
      </div>
      <nav aria-label="Navigation principale" className="mt-8 flex flex-col gap-1">
        {navigation.map(({ label, icon: Icon, active, to, badge }) => {
          const badgeValue = label === "Notifications" ? notificationsBadge : badge;
          const className = active ? "nav-item-active" : "nav-item";
          const content = (
            <>
              <Icon className="size-[17px]" strokeWidth={1.8} />
              <span>{label}</span>
              {badgeValue != null && (
                <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                  {badgeValue}
                </span>
              )}
            </>
          );
          return to ? (
            <Link key={label} to={to} aria-current={active ? "page" : undefined} className={className}>
              {content}
            </Link>
          ) : (
            <a key={label} href="#" aria-current={active ? "page" : undefined} className={className}>
              {content}
            </a>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-3 rounded-xl border border-border/70 bg-card/65 p-3 backdrop-blur-md">
        <img
          src={marieAvatar}
          alt="Marie, propriétaire de Boutique Marie"
          width={512}
          height={512}
          loading="lazy"
          className="size-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Boutique Marie</p>
          <p className="truncate text-[11px] text-muted-foreground">Marie D.</p>
        </div>
        <span className="ml-auto size-2 rounded-full bg-success" aria-label="En ligne" />
      </div>
    </aside>
  );
}

function MobileHeader({ unreadCount }: { unreadCount: number }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-2.5">
        <BrandMark />
        <span className="font-display font-semibold">KOMANDA</span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground"
        >
          <Bell className="size-[17px]" />
          {unreadCount > 0 && (
            <span
              className="absolute right-1.5 top-1.5 size-2 rounded-full bg-warning"
              aria-label="Notifications non lues"
            />
          )}
        </Link>
        <img src={marieAvatar} alt="Marie" width={512} height={512} className="size-9 rounded-full object-cover" />
      </div>
    </header>
  );
}

function MobileNav() {
  const navigation: NavItem[] = [
    { label: "Dashboard", icon: Gauge, to: "/" },
    { label: "Commandes", icon: ClipboardList, to: "/commandes" },
    { label: "Clients", icon: Users, to: "/clients" },
    { label: "Produits", icon: Package, to: "/produits" },
    { label: "Ventes", icon: TrendingUp, to: "/ventes" },
  ];
  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-xl border border-border/80 bg-card/92 px-1 py-1.5 shadow-float backdrop-blur-xl lg:hidden"
    >
      {navigation.map(({ label, icon: Icon, active, to }) => {
        const className = `flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[9px] font-medium ${active ? "bg-secondary text-primary" : "text-muted-foreground"}`;
        const content = (
          <>
            <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
            <span>{label}</span>
          </>
        );
        return to ? (
          <Link key={label} to={to} aria-label={label} className={className}>
            {content}
          </Link>
        ) : (
          <a key={label} href="#" aria-label={label} className={className}>
            {content}
          </a>
        );
      })}
    </nav>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-border"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-card shadow-sm transition-all duration-200 ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

function ParametresPage() {
  const unreadNotifications = useUnreadNotifications();
  const [saved, setSaved] = useState(false);
  const [enabledToggles, setEnabledToggles] = useState<Record<string, boolean>>({
    "new-orders": true,
    "low-stock": true,
    payments: true,
    "weekly-summary": false,
  });

  const toggle = (id: string) =>
    setEnabledToggles((current) => ({ ...current, [id]: !current[id] }));

  const saveChanges = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      <MobileHeader unreadCount={unreadNotifications} />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar notificationsBadge={unreadNotifications > 0 ? unreadNotifications : undefined} />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          <header className="mb-6">
            <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
              Paramètres
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Gérez votre boutique et vos préférences.</p>
          </header>

          <section aria-label="Profil de la boutique" className="content-card">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="section-title">Profil de la boutique</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Informations visibles par vos clients.</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                <Store className="size-[17px]" strokeWidth={1.8} />
              </span>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-muted/70 p-4">
              <img
                src={marieAvatar}
                alt="Marie, propriétaire de Boutique Marie"
                width={512}
                height={512}
                loading="lazy"
                className="size-14 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Boutique Marie</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">marie@boutiquemarie.com</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {shopFields.map(({ id, label, value }) => (
                <label key={id} className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                  <input
                    type="text"
                    defaultValue={value}
                    aria-label={label}
                    className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={saveChanges}
                className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Enregistrer les modifications
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-success" role="status">
                  <CheckCircle2 className="size-3.5" /> Modifications enregistrées
                </span>
              )}
            </div>
          </section>

          <section aria-label="Préférences" className="content-card mt-3.5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="section-title">Préférences</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Devise, langue et fuseau horaire.</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                <Globe className="size-[17px]" strokeWidth={1.8} />
              </span>
            </div>
            <div className="divide-y divide-border/70">
              {Object.entries(preferenceOptions).map(([label, options]) => (
                <div key={label} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                  <p className="text-sm font-medium">{label}</p>
                  <select
                    aria-label={label}
                    className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none transition-colors focus:border-primary"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Notifications" className="content-card mt-3.5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="section-title">Notifications</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Choisissez ce que vous voulez recevoir.</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                <Bell className="size-[17px]" strokeWidth={1.8} />
              </span>
            </div>
            <div className="divide-y divide-border/70">
              {notificationPreferences.map(({ id, label, description }) => (
                <div key={id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                  <ToggleSwitch checked={enabledToggles[id]} onChange={() => toggle(id)} label={label} />
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Compte et sécurité" className="content-card mt-3.5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="section-title">Compte et sécurité</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Protégez l'accès à votre boutique.</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                <ShieldCheck className="size-[17px]" strokeWidth={1.8} />
              </span>
            </div>
            <div className="divide-y divide-border/70">
              {securityItems.map(({ id, label, description, action }) => (
                <div key={id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                  <button
                    type="button"
                    className={`h-9 rounded-lg border px-3.5 text-sm font-semibold transition-colors ${
                      action === "Supprimer"
                        ? "border-danger/40 text-danger hover:bg-danger/10"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {action}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Facturation" className="content-card mt-3.5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="section-title">Facturation</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Votre abonnement et vos paiements.</p>
              </div>
              <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                <Wallet className="size-[17px]" strokeWidth={1.8} />
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-muted/70 p-4">
              <div>
                <p className="text-sm font-semibold">
                  Plan actuel : <span className="text-primary">Gratuit</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">87 commandes ce mois-ci · limite 100 commandes</p>
              </div>
              <button
                type="button"
                className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Passer au plan Pro
              </button>
            </div>
          </section>

          <div className="mt-6 flex justify-center lg:justify-start">
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="size-4" strokeWidth={1.8} /> Se déconnecter
            </button>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
