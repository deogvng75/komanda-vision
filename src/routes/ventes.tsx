import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CircleDollarSign, Clock, Plus, Search, ShoppingBag, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/Modal";
import {
  DAY_MS,
  formatDate,
  formatMoney,
  startOfDay,
  useOrders,
  useSettingsSnapshot,
  type Order,
} from "../lib/data";
import { pushNotification } from "../lib/notifications";

export const Route = createFileRoute("/ventes")({
  head: () => ({
    meta: [
      { title: "Ventes | KOMANDA" },
      { name: "description", content: "Suivez vos ventes et vos revenus avec KOMANDA." },
      { property: "og:title", content: "Ventes | KOMANDA" },
      { property: "og:description", content: "Suivez vos ventes et vos revenus avec KOMANDA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VentesPage,
});

const statusFilters = ["Toutes", "Payée", "En attente"];
const periodFilters = ["Toutes", "Aujourd'hui", "Hier", "7 derniers jours", "30 derniers jours"];

const selectClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2 sm:w-auto";

function inPeriod(iso: string, period: string): boolean {
  const time = new Date(iso).getTime();
  const today = startOfDay(Date.now());
  switch (period) {
    case "Aujourd'hui":
      return time >= today;
    case "Hier":
      return time >= today - DAY_MS && time < today;
    case "7 derniers jours":
      return time >= today - 6 * DAY_MS;
    case "30 derniers jours":
      return time >= today - 29 * DAY_MS;
    default:
      return true;
  }
}

const statusTone = (status: Order["paymentStatus"]) => (status === "Payée" ? "success" : "warning");

function SaleDetail({
  sale,
  currency,
  onMarkPaid,
  onClose,
}: {
  sale: Order;
  currency: string;
  onMarkPaid: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Détail de la vente" onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <TrendingUp className="size-6" strokeWidth={1.8} />
        </div>
        <div>
          <p className="font-display text-base font-semibold">V-{sale.number}</p>
          <p className="text-xs text-muted-foreground">{formatDate(sale.createdAt)}</p>
        </div>
        <span className={`status-badge status-${statusTone(sale.paymentStatus)} ml-auto`}>
          {sale.paymentStatus === "Payée" && <CheckCircle2 className="size-3" />}
          {sale.paymentStatus}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Client</span>
          <span className="font-medium">{sale.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Produit</span>
          <span className="font-medium">{sale.productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quantité</span>
          <span className="font-semibold">{sale.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Montant</span>
          <span className="font-semibold tabular-nums">{formatMoney(sale.amount, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mode de paiement</span>
          <span className="font-medium">{sale.paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Commande</span>
          <span className="font-medium">
            #{sale.number} · {sale.status}
          </span>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Fermer
        </button>
        {sale.paymentStatus === "En attente" && (
          <button
            type="button"
            onClick={onMarkPaid}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Marquer comme payée
          </button>
        )}
      </div>
    </Modal>
  );
}

function VentesPage() {
  const { items: orders, update, ready } = useOrders();
  const { currency } = useSettingsSnapshot();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Toutes");
  const [periodFilter, setPeriodFilter] = useState("Toutes");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Une vente = une commande non annulée.
  const sales = useMemo(
    () => orders.filter((order) => order.status !== "Annulée").sort((a, b) => b.number - a.number),
    [orders],
  );
  const selectedSale = sales.find((s) => s.id === selectedId) ?? null;

  const filteredSales = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sales.filter((sale) => {
      const matchesTerm =
        !term ||
        `v-${sale.number}`.includes(term) ||
        sale.clientName.toLowerCase().includes(term) ||
        sale.productName.toLowerCase().includes(term) ||
        String(sale.amount).includes(term);
      const matchesStatus = statusFilter === "Toutes" || sale.paymentStatus === statusFilter;
      return matchesTerm && matchesStatus && inPeriod(sale.createdAt, periodFilter);
    });
  }, [sales, search, statusFilter, periodFilter]);

  const paidTotal = filteredSales.filter((s) => s.paymentStatus === "Payée").reduce((sum, s) => sum + s.amount, 0);
  const pendingTotal = filteredSales
    .filter((s) => s.paymentStatus === "En attente")
    .reduce((sum, s) => sum + s.amount, 0);
  const allTotal = paidTotal + pendingTotal;
  const averageBasket = filteredSales.length > 0 ? Math.round(allTotal / filteredSales.length) : 0;

  const summary = [
    { label: "Chiffre d'affaires", value: formatMoney(paidTotal, currency), detail: "Ventes payées", icon: CircleDollarSign },
    { label: "En attente de paiement", value: formatMoney(pendingTotal, currency), detail: "À encaisser", icon: Clock },
    { label: "Nombre de ventes", value: String(filteredSales.length), detail: "Selon les filtres", icon: ShoppingBag },
    { label: "Panier moyen", value: formatMoney(averageBasket, currency), detail: "Par vente", icon: TrendingUp },
  ];

  const handleMarkPaid = (sale: Order) => {
    update((list) => list.map((o) => (o.id === sale.id ? { ...o, paymentStatus: "Payée" } : o)));
    pushNotification({
      type: "Paiement",
      title: "Paiement reçu",
      message: `${sale.clientName} a réglé la commande #${sale.number} (${formatMoney(sale.amount, currency)}).`,
      detailsTo: "/ventes",
    });
  };

  return (
    <AppShell active="ventes">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold leading-tight sm:text-[36px]">Ventes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivez vos ventes et vos revenus. Chaque vente vient d'une commande non annulée.
          </p>
        </div>
        <Link
          to="/commandes"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nouvelle vente
        </Link>
      </header>

      <section aria-label="Indicateurs de ventes" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(({ label, value, detail, icon: Icon }, index) => (
          <article key={label} className="metric-card" style={{ animationDelay: `${index * 60}ms` }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
                <Icon className="size-4" strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-3 font-display text-[25px] font-semibold tabular-nums">{value}</p>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">{detail}</p>
          </article>
        ))}
      </section>

      <section className="content-card mt-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une vente..."
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm outline-none ring-ring transition-shadow focus:ring-2"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrer par statut"
              className={selectClass}
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status === "Toutes" ? "Statut : Toutes" : status}
                </option>
              ))}
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              aria-label="Filtrer par période"
              className={selectClass}
            >
              {periodFilters.map((period) => (
                <option key={period} value={period}>
                  {period === "Toutes" ? "Période : Toutes" : period}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="content-card mt-3.5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Historique des ventes</h2>
          <span className="text-xs font-semibold text-primary">{filteredSales.length} vente(s)</span>
        </div>

        {ready && sales.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
              <TrendingUp className="size-6" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-sm font-semibold">Aucune vente pour le moment</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Vos ventes apparaissent ici dès que vous créez une commande.
              </p>
            </div>
            <Link
              to="/commandes"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Créer une commande
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {filteredSales.map((sale) => (
              <button
                key={sale.id}
                type="button"
                onClick={() => setSelectedId(sale.id)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 text-left transition-colors hover:bg-muted/50 sm:grid-cols-[110px_80px_1fr_160px_60px_130px_110px] sm:gap-x-4"
              >
                <p className="text-sm text-muted-foreground">{formatDate(sale.createdAt)}</p>
                <p className="hidden text-sm font-semibold text-primary sm:block">V-{sale.number}</p>
                <p className="truncate text-sm font-semibold sm:font-medium">{sale.clientName}</p>
                <p className="hidden truncate text-sm text-muted-foreground sm:block">{sale.productName}</p>
                <p className="hidden text-sm tabular-nums sm:block">{sale.quantity}</p>
                <p className="order-4 text-sm font-semibold tabular-nums sm:order-none sm:text-right">
                  {formatMoney(sale.amount, currency)}
                </p>
                <span className={`status-badge status-${statusTone(sale.paymentStatus)}`}>
                  {sale.paymentStatus === "Payée" && <CheckCircle2 className="size-3" />}
                  {sale.paymentStatus}
                </span>
              </button>
            ))}
            {ready && filteredSales.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucune vente trouvée.</p>
            )}
          </div>
        )}
      </section>

      {selectedSale && (
        <SaleDetail
          sale={selectedSale}
          currency={currency}
          onMarkPaid={() => handleMarkPaid(selectedSale)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </AppShell>
  );
}
