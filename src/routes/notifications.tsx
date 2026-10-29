import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCheck, ChevronRight, CircleDollarSign, ClipboardList, Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import {
  DEFAULT_NOTIFICATIONS,
  loadNotifications,
  saveNotifications,
  type NotificationItem,
  type NotificationType,
} from "../lib/notifications";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | KOMANDA" },
      {
        name: "description",
        content: "Retrouvez toutes les activités importantes de votre boutique avec KOMANDA.",
      },
      { property: "og:title", content: "Notifications | KOMANDA" },
      {
        property: "og:description",
        content: "Retrouvez toutes les activités importantes de votre boutique avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotificationsPage,
});

const filters = ["Toutes", "Non lues", "Commandes", "Stock", "Paiements"];

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

function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("Toutes");

  // Charge les notifications enregistrées après hydratation.
  useEffect(() => {
    setNotifications(loadNotifications());
    setLoaded(true);
  }, []);

  // N'enregistre qu'après le chargement, pour ne jamais écraser les données existantes.
  useEffect(() => {
    if (loaded) saveNotifications(notifications);
  }, [notifications, loaded]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "Toutes") return notifications;
    if (filter === "Non lues") return notifications.filter((n) => n.unread);
    const type: NotificationType =
      filter === "Commandes" ? "Commande" : filter === "Stock" ? "Stock" : "Paiement";
    return notifications.filter((n) => n.type === type);
  }, [notifications, filter]);

  const markAllRead = () => setNotifications((list) => list.map((n) => ({ ...n, unread: false })));

  const markRead = (id: string) =>
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <AppShell active="notifications">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex flex-wrap items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Retrouvez toutes les activités importantes de votre boutique.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={
                filter === f
                  ? "rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                  : "rounded-full border border-input bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
              <div
                key={n.id}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                  n.unread ? "border-primary/15 bg-secondary/50" : "border-transparent bg-muted/40"
                }`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                    n.unread ? "bg-card text-primary" : "bg-card/70 text-muted-foreground"
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    title={n.unread ? "Marquer comme lue" : undefined}
                    className="block w-full text-left"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm ${n.unread ? "font-semibold" : "font-medium"}`}>{n.title}</span>
                      <span className={`status-badge status-${typeTone[n.type]}`}>{n.type}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{n.message}</span>
                  </button>
                  {n.detailsTo && (
                    <Link
                      to={n.detailsTo}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Voir les détails
                      <ChevronRight className="size-3.5" />
                    </Link>
                  )}
                </div>
                <span className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="whitespace-nowrap text-[11px] text-muted-foreground">{n.time}</span>
                  <span
                    className={`size-2 rounded-full ${n.unread ? "bg-primary" : "bg-transparent"}`}
                    aria-label={n.unread ? "Non lue" : "Lue"}
                  />
                </span>
              </div>
            );
          })}
          {filteredNotifications.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Bell className="size-8 text-muted-foreground" strokeWidth={1.8} />
              <p className="text-sm font-medium">Aucune notification</p>
              <p className="text-xs text-muted-foreground">
                Les activités de votre boutique apparaîtront ici : nouvelles commandes, paiements et stock bas.
              </p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
