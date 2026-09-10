import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  CircleDollarSign,
  Gauge,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import marieAvatar from "../assets/marie-avatar.jpg";

export const Route = createFileRoute("/ventes")({
  head: () => ({
    meta: [
      { title: "Ventes | KOMANDA" },
      {
        name: "description",
        content: "Suivez vos ventes et vos revenus avec KOMANDA.",
      },
      { property: "og:title", content: "Ventes | KOMANDA" },
      {
        property: "og:description",
        content: "Suivez vos ventes et vos revenus avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VentesPage,
});

const navigation = [
  { label: "Dashboard", icon: Gauge, to: "/" },
  { label: "Commandes", icon: ClipboardList, to: "/commandes" },
  { label: "Clients", icon: Users, to: "/clients" },
  { label: "Produits", icon: Package, to: "/produits" },
  { label: "Ventes", icon: TrendingUp, active: true, to: "/ventes" },
  { label: "Notifications", icon: Bell },
  { label: "Paramètres", icon: Settings },
];

const statusFilters = ["Toutes", "Payée", "En attente"];
const periodFilters = ["Toutes", "Aujourd'hui", "Hier", "7 derniers jours"];

const sales = [
  {
    id: "v1",
    reference: "V-1052",
    date: "Aujourd'hui",
    daysAgo: 0,
    client: "Sarah M.",
    product: "Robe Élégance",
    quantity: 1,
    amount: 28000,
    payment: "Mobile Money",
    status: "Payée",
  },
  {
    id: "v2",
    reference: "V-1051",
    date: "Aujourd'hui",
    daysAgo: 0,
    client: "David K.",
    product: "Sneakers Classic",
    quantity: 1,
    amount: 60000,
    payment: "Espèces",
    status: "Payée",
  },
  {
    id: "v3",
    reference: "V-1050",
    date: "Hier",
    daysAgo: 1,
    client: "Marie L.",
    product: "Sac Milano",
    quantity: 1,
    amount: 45000,
    payment: "Mobile Money",
    status: "Payée",
  },
  {
    id: "v4",
    reference: "V-1049",
    date: "Il y a 2 jours",
    daysAgo: 2,
    client: "Alice P.",
    product: "Parfum Signature",
    quantity: 1,
    amount: 35000,
    payment: "En attente",
    status: "En attente",
  },
  {
    id: "v5",
    reference: "V-1048",
    date: "Il y a 3 jours",
    daysAgo: 3,
    client: "Kevin B.",
    product: "Montre Prestige",
    quantity: 1,
    amount: 75000,
    payment: "Virement",
    status: "Payée",
  },
];

function formatCurrency(value: number) {
  return `${value.toLocaleString("fr-FR")} CDF`;
}

function statusTone(status: string) {
  return status === "Payée" ? "success" : "warning";
}

function BrandMark() {
  return (
    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-brand">
      K
    </div>
  );
}

function Sidebar() {
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
        {navigation.map(({ label, icon: Icon, active, to }) => {
          const className = active ? "nav-item-active" : "nav-item";
          const content = (
            <>
              <Icon className="size-[17px]" strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Commandes" && (
                <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                  12
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

function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-2.5">
        <BrandMark />
        <span className="font-display font-semibold">KOMANDA</span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="#notifications"
          aria-label="Notifications"
          className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground"
        >
          <Bell className="size-[17px]" />
        </a>
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

function SaleDetail({
  sale,
  onClose,
}: {
  sale: (typeof sales)[number];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Détail de la vente</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto pr-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <TrendingUp className="size-6" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-display text-base font-semibold">{sale.reference}</p>
              <p className="text-xs text-muted-foreground">{sale.date}</p>
            </div>
            <span className={`status-badge status-${statusTone(sale.status)} ml-auto`}>
              {sale.status === "Payée" && <CheckCircle2 className="size-3" />}
              {sale.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client</span>
              <span className="font-medium">{sale.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Produit</span>
              <span className="font-medium">{sale.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantité</span>
              <span className="font-semibold">{sale.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Montant</span>
              <span className="font-semibold tabular-nums">{formatCurrency(sale.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode de paiement</span>
              <span className="font-medium">{sale.payment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut</span>
              <span className={`status-badge status-${statusTone(sale.status)}`}>{sale.status}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function NewSaleModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Nouvelle vente</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          L'enregistrement d'une nouvelle vente sera bientôt disponible. Les ventes affichées ici sont des données
          d'exemple.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function VentesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Toutes");
  const [periodFilter, setPeriodFilter] = useState("Toutes");
  const [selectedSale, setSelectedSale] = useState<(typeof sales)[number] | null>(null);
  const [showNewSale, setShowNewSale] = useState(false);

  const filteredSales = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sales.filter((sale) => {
      const matchesTerm =
        !term ||
        sale.reference.toLowerCase().includes(term) ||
        sale.client.toLowerCase().includes(term) ||
        sale.product.toLowerCase().includes(term) ||
        String(sale.amount).includes(term);
      const matchesStatus = statusFilter === "Toutes" || sale.status === statusFilter;
      const matchesPeriod =
        periodFilter === "Toutes" ||
        (periodFilter === "Aujourd'hui" && sale.daysAgo === 0) ||
        (periodFilter === "Hier" && sale.daysAgo === 1) ||
        (periodFilter === "7 derniers jours" && sale.daysAgo <= 7);
      return matchesTerm && matchesStatus && matchesPeriod;
    });
  }, [search, statusFilter, periodFilter]);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const averageBasket = Math.round(totalRevenue / sales.length);

  const summary = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(totalRevenue),
      detail: `${filteredSales.length} vente(s) affichée(s)`,
      icon: CircleDollarSign,
    },
    {
      label: "Nombre de ventes",
      value: String(sales.length),
      detail: "7 derniers jours",
      icon: ShoppingBag,
    },
    {
      label: "Panier moyen",
      value: formatCurrency(averageBasket),
      detail: "Par vente",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      <MobileHeader />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
                Ventes
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Suivez vos ventes et vos revenus.</p>
            </div>
            <button
              onClick={() => setShowNewSale(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Nouvelle vente
            </button>
          </header>

          <section aria-label="Indicateurs de ventes" className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
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
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2 sm:w-auto"
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
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2 sm:w-auto"
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
            <div className="divide-y divide-border/70">
              {filteredSales.map((sale) => (
                <button
                  key={sale.id}
                  onClick={() => setSelectedSale(sale)}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 text-left transition-colors hover:bg-muted/50 sm:grid-cols-[130px_100px_1fr_160px_90px_130px_110px] sm:gap-x-4"
                >
                  <p className="text-sm text-muted-foreground">{sale.date}</p>
                  <p className="hidden text-sm font-semibold text-primary sm:block">{sale.reference}</p>
                  <p className="text-sm font-semibold sm:font-medium">{sale.client}</p>
                  <p className="hidden text-sm text-muted-foreground sm:block">{sale.product}</p>
                  <p className="hidden text-sm tabular-nums sm:block">{sale.quantity}</p>
                  <p className="order-4 text-sm font-semibold tabular-nums sm:order-none sm:text-right">
                    {formatCurrency(sale.amount)}
                  </p>
                  <span className={`status-badge status-${statusTone(sale.status)}`}>
                    {sale.status === "Payée" && <CheckCircle2 className="size-3" />}
                    {sale.status}
                  </span>
                </button>
              ))}
              {filteredSales.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">Aucune vente trouvée.</p>
              )}
            </div>
          </section>
        </main>
      </div>
      <MobileNav />

      {selectedSale && <SaleDetail sale={selectedSale} onClose={() => setSelectedSale(null)} />}
      {showNewSale && <NewSaleModal onClose={() => setShowNewSale(false)} />}
    </div>
  );
}
