import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Box,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Hand,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { AppShell } from "../components/AppShell";
import {
  DAY_MS,
  formatMoney,
  orderStatusTone,
  startOfDay,
  stockStatus,
  useClients,
  useOrders,
  useProducts,
  useSettingsSnapshot,
  type Order,
} from "../lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard commercial | KOMANDA" },
      {
        name: "description",
        content: "KOMANDA, le copilote commercial des vendeurs sur les réseaux sociaux.",
      },
      { property: "og:title", content: "Dashboard commercial | KOMANDA" },
      {
        property: "og:description",
        content: "Pilotez commandes, clients et ventes simplement avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Trend = "up" | "down" | "flat";

function sumBetween(orders: Order[], from: number, to: number) {
  return orders
    .filter((o) => {
      const time = new Date(o.createdAt).getTime();
      return time >= from && time < to;
    })
    .reduce((sum, o) => sum + o.amount, 0);
}

function compare(current: number, previous: number, label: string): { text: string; trend: Trend } | null {
  if (previous <= 0) return null;
  const change = Math.round(((current - previous) / previous) * 1000) / 10;
  if (change === 0) return { text: `Stable vs ${label}`, trend: "flat" };
  const formatted = Math.abs(change).toLocaleString("fr-FR");
  return change > 0
    ? { text: `↑ ${formatted} % vs ${label}`, trend: "up" }
    : { text: `↓ ${formatted} % vs ${label}`, trend: "down" };
}

const trendClass: Record<Trend, string> = {
  up: "text-success",
  down: "text-warning",
  flat: "text-muted-foreground",
};

function Dashboard() {
  const { items: orders, ready: ordersReady } = useOrders();
  const { items: products, ready: productsReady } = useProducts();
  const { items: clients, ready: clientsReady } = useClients();
  const { currency, ownerName } = useSettingsSnapshot();
  const ready = ordersReady && productsReady && clientsReady;

  const data = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

    const valid = orders.filter((o) => o.status !== "Annulée");
    const paid = valid.filter((o) => o.paymentStatus === "Payée");

    const revenueToday = sumBetween(paid, today, today + DAY_MS);
    const revenueYesterday = sumBetween(paid, today - DAY_MS, today);
    const revenueMonth = sumBetween(paid, monthStart, nextMonthStart);
    const revenuePrevMonth = sumBetween(paid, prevMonthStart, monthStart);

    const week = Array.from({ length: 7 }, (_, index) => {
      const dayStart = today - (6 - index) * DAY_MS;
      const label = new Date(dayStart).toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
      return { day: label.charAt(0).toUpperCase() + label.slice(1), value: sumBetween(paid, dayStart, dayStart + DAY_MS) };
    });
    const weekTotal = week.reduce((sum, d) => sum + d.value, 0);
    const prevWeekTotal = sumBetween(paid, today - 13 * DAY_MS, today - 6 * DAY_MS);

    return {
      revenueToday,
      revenueMonth,
      todayCompare: compare(revenueToday, revenueYesterday, "hier"),
      monthCompare: compare(revenueMonth, revenuePrevMonth, "le mois dernier"),
      week,
      weekTotal,
      weekCompare: compare(weekTotal, prevWeekTotal, "la semaine d'avant"),
      weekMax: Math.max(...week.map((d) => d.value), 0),
      ordersCount: valid.length,
      ordersThisWeek: valid.filter((o) => new Date(o.createdAt).getTime() >= today - 6 * DAY_MS).length,
      toConfirm: orders.filter((o) => o.status === "Nouvelle").length,
      pendingPayments: valid.filter((o) => o.paymentStatus === "En attente").length,
      lowStock: products.filter((p) => stockStatus(p) !== "En stock").length,
      recent: [...orders].sort((a, b) => b.number - a.number).slice(0, 5),
    };
  }, [orders, products]);

  const stats = [
    {
      label: "CA aujourd'hui",
      value: formatMoney(data.revenueToday, currency),
      detail: data.todayCompare?.text ?? "Ventes payées aujourd'hui",
      trend: data.todayCompare?.trend ?? "flat",
      icon: CircleDollarSign,
    },
    {
      label: "CA du mois",
      value: formatMoney(data.revenueMonth, currency),
      detail: data.monthCompare?.text ?? "Ventes payées ce mois-ci",
      trend: data.monthCompare?.trend ?? "flat",
      icon: TrendingUp,
    },
    {
      label: "Commandes",
      value: String(data.ordersCount),
      detail: `${data.ordersThisWeek} cette semaine`,
      trend: "flat" as Trend,
      icon: ShoppingBag,
    },
    {
      label: "À traiter",
      value: String(data.toConfirm),
      detail: "Nouvelles commandes à confirmer",
      trend: "flat" as Trend,
      icon: ClipboardList,
    },
  ];

  const tasks = [
    { count: data.toConfirm, label: "commandes à confirmer", icon: ClipboardList, to: "/commandes" },
    { count: data.pendingPayments, label: "paiements en attente", icon: CircleDollarSign, to: "/ventes" },
    { count: data.lowStock, label: "produits bientôt en rupture", icon: Box, to: "/produits" },
  ] as const;
  const activeTasks = tasks.filter((t) => t.count > 0);

  const steps = [
    { done: products.length > 0, label: "Ajoutez vos produits et votre stock", to: "/produits" },
    { done: clients.length > 0, label: "Ajoutez vos clients", to: "/clients" },
    { done: orders.length > 0, label: "Enregistrez votre première commande", to: "/commandes" },
  ] as const;
  const showOnboarding = ready && steps.some((s) => !s.done);

  const firstName = ownerName.trim().split(" ")[0];

  return (
    <AppShell active="dashboard">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
          Bonjour{firstName ? `, ${firstName}` : ""}{" "}
          <Hand aria-hidden="true" className="size-7 text-warning sm:size-8" strokeWidth={1.8} />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Voici ce qui se passe dans votre boutique aujourd'hui.</p>
      </header>

      {showOnboarding && (
        <section className="content-card mb-3.5" aria-label="Pour commencer">
          <h2 className="section-title">Pour commencer</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Trois étapes pour que KOMANDA suive vraiment votre activité.
          </p>
          <div className="mt-4 space-y-2.5">
            {steps.map((step, index) => (
              <Link
                key={step.label}
                to={step.to}
                className="flex items-center gap-3 rounded-xl bg-muted/70 p-3 transition-colors hover:bg-muted"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    step.done ? "bg-primary text-primary-foreground" : "bg-card text-primary"
                  }`}
                >
                  {step.done ? <CheckCircle2 className="size-4" /> : index + 1}
                </span>
                <span className={`text-sm font-medium ${step.done ? "text-muted-foreground line-through" : ""}`}>
                  {step.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Indicateurs clés" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, trend, icon: Icon }, index) => (
          <article key={label} className="metric-card" style={{ animationDelay: `${index * 60}ms` }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-3 font-display text-[25px] font-semibold tabular-nums">{value}</p>
            <p className={`mt-1.5 text-xs font-medium ${trendClass[trend]}`}>{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <article className="content-card lg:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="section-title">Évolution des ventes</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                7 derniers jours · {formatMoney(data.weekTotal, currency)}
              </p>
            </div>
            {data.weekCompare && (
              <span className={`rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold ${trendClass[data.weekCompare.trend]}`}>
                {data.weekCompare.text}
              </span>
            )}
          </div>
          <div className="flex h-48 items-end justify-between gap-2 sm:gap-3" aria-label="Graphique des ventes des sept derniers jours">
            {data.week.map(({ day, value }, index) => {
              const height = data.weekMax > 0 ? Math.max((value / data.weekMax) * 100, value > 0 ? 6 : 2) : 2;
              const isToday = index === data.week.length - 1;
              return (
                <div key={`${day}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`sales-bar ${isToday ? "sales-bar-current" : ""}`}
                      style={{ height: `${height}%`, animationDelay: `${280 + index * 45}ms` }}
                      title={formatMoney(value, currency)}
                    />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] ${isToday ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          {ready && data.weekTotal === 0 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Aucune vente payée sur cette période. Le graphique se remplit dès qu'une commande est marquée comme payée.
            </p>
          )}
        </article>

        <article className="content-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">À faire</h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {activeTasks.length} action(s)
            </span>
          </div>
          {activeTasks.length === 0 ? (
            <p className="rounded-xl bg-muted/70 p-3 text-sm text-muted-foreground">
              Tout est à jour pour le moment.
            </p>
          ) : (
            <div className="space-y-2.5">
              {activeTasks.map(({ count, label, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-3 rounded-xl bg-muted/70 p-3 transition-colors hover:bg-muted"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-primary">
                    <Icon className="size-[17px]" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      <span className="text-primary">{count}</span> {label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Nécessite votre attention</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="content-card mt-3.5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Commandes récentes</h2>
          <Link to="/commandes" className="text-xs font-semibold text-primary hover:underline">
            Voir tout
          </Link>
        </div>
        {data.recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Aucune commande pour le moment.</p>
        ) : (
          <div className="divide-y divide-border/70">
            {data.recent.map((order) => {
              const tone = orderStatusTone(order.status);
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[90px_1fr_140px_120px]"
                >
                  <p className="text-sm font-semibold text-primary">#{order.number}</p>
                  <p className="truncate text-sm font-medium">{order.clientName}</p>
                  <p className="order-4 text-sm font-semibold tabular-nums sm:order-none sm:text-right">
                    {formatMoney(order.amount, currency)}
                  </p>
                  <span className={`status-badge status-${tone}`}>
                    {tone === "success" && <CheckCircle2 className="size-3" />}
                    {order.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
