import { Link } from "@tanstack/react-router";
import { Bell, ClipboardList, Gauge, Package, Settings, TrendingUp, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useOrders, useSettingsSnapshot } from "../lib/data";
import { useUnreadNotifications } from "../lib/notifications";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: Gauge, to: "/" },
  { key: "commandes", label: "Commandes", icon: ClipboardList, to: "/commandes" },
  { key: "clients", label: "Clients", icon: Users, to: "/clients" },
  { key: "produits", label: "Produits", icon: Package, to: "/produits" },
  { key: "ventes", label: "Ventes", icon: TrendingUp, to: "/ventes" },
  { key: "notifications", label: "Notifications", icon: Bell, to: "/notifications" },
  { key: "parametres", label: "Paramètres", icon: Settings, to: "/parametres" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

function BrandMark() {
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-brand">
      K
    </div>
  );
}

function Initial({ name, className }: { name: string; className: string }) {
  const letter = (name.trim().charAt(0) || "K").toUpperCase();
  return (
    <div
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-secondary font-display font-semibold text-primary ${className}`}
    >
      {letter}
    </div>
  );
}

export function AppShell({ active, children }: { active: NavKey; children: ReactNode }) {
  const { items: orders } = useOrders();
  const unreadNotifications = useUnreadNotifications();
  const settings = useSettingsSnapshot();

  const shopName = settings.shopName.trim() || "Ma boutique";
  const ownerName = settings.ownerName.trim();
  const pendingOrders = orders.filter((order) => order.status === "Nouvelle").length;

  const badgeFor = (key: NavKey): number | undefined => {
    if (key === "commandes" && pendingOrders > 0) return pendingOrders;
    if (key === "notifications" && unreadNotifications > 0) return unreadNotifications;
    return undefined;
  };

  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      {/* En-tête mobile */}
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
            {unreadNotifications > 0 && (
              <span
                className="absolute right-1.5 top-1.5 size-2 rounded-full bg-warning"
                aria-label="Notifications non lues"
              />
            )}
          </Link>
          <Link to="/parametres" aria-label="Paramètres">
            <Initial name={shopName} className="size-9 text-sm" />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {/* Barre latérale */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/70 bg-sidebar/72 px-5 py-6 backdrop-blur-xl lg:flex">
          <div className="flex items-center gap-2.5 px-1">
            <BrandMark />
            <div>
              <p className="font-display text-[15px] font-semibold leading-none">KOMANDA</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Le copilote commercial</p>
            </div>
          </div>
          <nav aria-label="Navigation principale" className="mt-8 flex flex-col gap-1">
            {NAV.map(({ key, label, icon: Icon, to }) => {
              const isActive = key === active;
              const badge = badgeFor(key);
              return (
                <Link
                  key={key}
                  to={to}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? "nav-item-active" : "nav-item"}
                >
                  <Icon className="size-[17px]" strokeWidth={1.8} />
                  <span>{label}</span>
                  {badge != null && (
                    <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex items-center gap-3 rounded-xl border border-border/70 bg-card/65 p-3 backdrop-blur-md">
            <Initial name={shopName} className="size-10 text-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{shopName}</p>
              {ownerName && <p className="truncate text-[11px] text-muted-foreground">{ownerName}</p>}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Navigation mobile */}
      <nav
        aria-label="Navigation mobile"
        className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-xl border border-border/80 bg-card/92 px-1 py-1.5 shadow-float backdrop-blur-xl lg:hidden"
      >
        {NAV.slice(0, 5).map(({ key, label, icon: Icon, to }) => {
          const isActive = key === active;
          return (
            <Link
              key={key}
              to={to}
              aria-label={label}
              className={`flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[9px] font-medium ${
                isActive ? "bg-secondary text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
