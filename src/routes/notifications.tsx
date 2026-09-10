import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  ClipboardList,
  CircleDollarSign,
  Gauge,
  Package,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import marieAvatar from "../assets/marie-avatar.jpg";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | KOMANDA" },
      {
        name: "description",
        content: "Restez informé des activités importantes de votre boutique avec KOMANDA.",
      },
      { property: "og:title", content: "Notifications | KOMANDA" },
      {
        property: "og:description",
        content: "Restez informé des activités importantes de votre boutique avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

type NavItem = {
  label: string;
  icon: typeof Gauge;
  active?: boolean;
  to?: string;
  badge?: number;
};

const navigation: NavItem[] = [
  { label: "Dashboard", icon: Gauge, to: "/" },
  { label: "Commandes", icon: ClipboardList, to: "/commandes", badge: 12 },
  { label: "Clients", icon: Users, to: "/clients" },
  { label: "Produits", icon: Package, to: "/produits" },
  { label: "Ventes", icon: TrendingUp, to: "/ventes" },
  { label: "Notifications", icon: Bell, active: true, to: "/notifications" },
  { label: "Paramètres", icon: Settings },
];

const filters = ["Toutes", "Non lues", "Commandes", "Stock", "Paiements"];

type NotificationType = "Commande" | "Stock" | "Paiement";

const typeIcon: Record<NotificationType, typeof ClipboardList> = {
  Commande: ClipboardList,
  Stock: Package,
  Paiement: CircleDollarSign,
};

const typeTone: Record<NotificationType, string> = {
  Commande: "info",
  Stock: "warning",
  Paiement: "success",
};

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "Commande",
    title: "Nouvelle commande",
    message: "La commande #1052 de Sarah M. a été confirmée.",
    time: "Il y a 5 min",
    unread: true,
  },
  {
    id: "n2",
    type: "Stock",
    title: "Stock faible",
    message: "Sneakers Classic : il ne reste que 3 unités.",
    time: "Il y a 30 min",
    unread: true,
  },
  {
    id: "n3",
    type: "Paiement",
    title: "Paiement reçu",
    message: "Paiement de 60 000 CDF reçu pour la commande #1051.",
    time: "Il y a 1 h",
    unread: true,
  },
  {
    id: "n4",
    type: "Commande",
    title: "Nouvelle commande",
    message: "La commande #1050 de Marie L. a été livrée.",
    time: "Hier",
    unread: false,
  },
  {
    id: "n5",
    type: "Stock",
    title: "Stock faible",
    message: "Parfum Signature : il ne reste que 2 unités.",
    time: "Hier",
    unread: false,
  },
];

function BrandMark() {
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-brand">
      K
    </div>
  );
}

function Sidebar({ notificationsBadge }: { notificationsBadge?: number }) {
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
  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-xl border border-border/80 bg-card/92 px-1 py-1.5 shadow-float backdrop-blur-xl lg:hidden"
    >
      {navigation.slice(0, 5).map(({ label, icon: Icon, active, to }) => {
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

function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("Toutes");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "Toutes") return notifications;
    if (filter === "Non lues") return notifications.filter((n) => n.unread);
    const type: NotificationType =
      filter === "Commandes" ? "Commande" : filter === "Stock" ? "Stock" : "Paiement";
    return notifications.filter((n) => n.type === type);
  }, [notifications, filter]);

  const markAllRead = () =>
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));

  const markRead = (id: string) =>
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      <MobileHeader unreadCount={unreadCount} />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar notificationsBadge={unreadCount > 0 ? unreadCount : undefined} />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
                Notifications
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Restez informé des activités importantes de votre boutique.
              </p>
            </div>
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="size-4" />
              Tout marquer comme lu
            </button>
          </header>

          <section className="content-card">
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrer les notifications">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={
                    filter === f
                      ? "rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                      : "rounded-full border border-input bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                  }
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredNotifications.map((n) => {
                const Icon = typeIcon[n.type];
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    title={n.unread ? "Marquer comme lue" : undefined}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                      n.unread
                        ? "border-primary/15 bg-secondary/50"
                        : "border-transparent bg-muted/40 hover:bg-muted/70"
                    }`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                        n.unread ? "bg-card text-primary" : "bg-card/70 text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm ${n.unread ? "font-semibold" : "font-medium"}`}>{n.title}</span>
                        <span className={`status-badge status-${typeTone[n.type]}`}>{n.type}</span>
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{n.message}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="whitespace-nowrap text-[11px] text-muted-foreground">{n.time}</span>
                      <span
                        className={`size-2 rounded-full ${n.unread ? "bg-primary" : "bg-transparent"}`}
                        aria-label={n.unread ? "Non lue" : "Lue"}
                      />
                    </span>
                  </button>
                );
              })}
              {filteredNotifications.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Bell className="size-8 text-muted-foreground" strokeWidth={1.8} />
                  <p className="text-sm font-medium">Aucune notification</p>
                  <p className="text-xs text-muted-foreground">
                    Les activités de votre boutique apparaîtront ici.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
