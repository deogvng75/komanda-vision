import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Box,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Hand,
  Menu,
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

export const Route = createFileRoute("/commandes")({
  head: () => ({
    meta: [
      { title: "Commandes | KOMANDA" },
      {
        name: "description",
        content: "Gérez et suivez toutes vos commandes avec KOMANDA.",
      },
      { property: "og:title", content: "Commandes | KOMANDA" },
      {
        property: "og:description",
        content: "Gérez et suivez toutes vos commandes avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommandesPage,
});

const navigation = [
  { label: "Dashboard", icon: Gauge, to: "/" },
  { label: "Commandes", icon: ClipboardList, active: true, to: "/commandes" },
  { label: "Clients", icon: Users },
  { label: "Produits", icon: Package },
  { label: "Ventes", icon: TrendingUp },
  { label: "Notifications", icon: Bell },
  { label: "Paramètres", icon: Settings },
];

const filters = [
  "Toutes",
  "Nouvelles",
  "Confirmées",
  "En préparation",
  "En livraison",
  "Livrées",
  "Annulées",
];

const orders = [
  {
    id: "#1052",
    customer: "Sarah M.",
    product: "Robe Élégance",
    quantity: 1,
    amount: "28 000 CDF",
    rawAmount: 28000,
    status: "Confirmée",
    payment: "Paiement mobile (Airtel Money)",
    address: "12 Av. de la Justice, Kinshasa",
  },
  {
    id: "#1051",
    customer: "David K.",
    product: "Sneakers Classic",
    quantity: 1,
    amount: "60 000 CDF",
    rawAmount: 60000,
    status: "En livraison",
    payment: "Espèces à la livraison",
    address: "45 Blvd du 30 Juin, Kinshasa",
  },
  {
    id: "#1050",
    customer: "Marie L.",
    product: "Sac Milano",
    quantity: 1,
    amount: "45 000 CDF",
    rawAmount: 45000,
    status: "Livrée",
    payment: "Carte bancaire",
    address: "78 Av. Kasa-Vubu, Kinshasa",
  },
  {
    id: "#1049",
    customer: "Alice P.",
    product: "Parfum Signature",
    quantity: 2,
    amount: "35 000 CDF",
    rawAmount: 35000,
    status: "Nouvelle",
    payment: "En attente",
    address: "21 Rue de l’Espoir, Kinshasa",
  },
  {
    id: "#1048",
    customer: "Kevin B.",
    product: "Montre Prestige",
    quantity: 1,
    amount: "75 000 CDF",
    rawAmount: 75000,
    status: "En préparation",
    payment: "Paiement mobile (M-Pesa)",
    address: "9 Blvd Lumumba, Kinshasa",
  },
];

function statusTone(status: string) {
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
    default:
      return "neutral";
  }
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

function OrderDetail({ order, onClose }: { order: (typeof orders)[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Détail de la commande</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Numéro</span>
            <span className="font-semibold text-primary">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client</span>
            <span className="font-medium">{order.customer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Produit</span>
            <span className="font-medium">{order.product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantité</span>
            <span className="font-medium">{order.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Montant</span>
            <span className="font-semibold tabular-nums">{order.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paiement</span>
            <span className="font-medium">{order.payment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Adresse</span>
            <span className="max-w-[55%] text-right font-medium">{order.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Statut</span>
            <span className={`status-badge status-${statusTone(order.status)}`}>
              {statusTone(order.status) === "success" && <CheckCircle2 className="size-3" />}
              {order.status}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function CommandesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[number] | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        [order.id, order.customer, order.product].some((field) =>
          field.toLowerCase().includes(search.trim().toLowerCase())
        ) || order.rawAmount.toString().includes(search.trim());
      const matchesFilter =
        activeFilter === "Toutes" || order.status.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      <MobileHeader />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
                Commandes
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Gérez et suivez toutes vos commandes.</p>
            </div>
            <button
              onClick={() => setShowNewOrder(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Nouvelle commande
            </button>
          </header>

          <section className="content-card mb-3.5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une commande ou un client..."
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const active = filter === activeFilter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="content-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="section-title">Liste des commandes</h2>
              <span className="text-xs font-semibold text-primary">{filteredOrders.length} commande(s)</span>
            </div>
            <div className="divide-y divide-border/70">
              {filteredOrders.map((order) => {
                const tone = statusTone(order.status);
                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[80px_1fr_120px_110px_90px]"
                  >
                    <p className="text-sm font-semibold text-primary">{order.id}</p>
                    <div className="sm:order-none">
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.product}</p>
                    </div>
                    <p className="order-4 text-sm font-semibold tabular-nums sm:order-none sm:text-right">{order.amount}</p>
                    <span className={`status-badge status-${tone}`}>
                      {tone === "success" && <CheckCircle2 className="size-3" />}
                      {order.status}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="order-5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent sm:order-none"
                    >
                      Voir
                    </button>
                  </div>
                );
              })}
              {filteredOrders.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">Aucune commande ne correspond à votre recherche.</div>
              )}
            </div>
          </section>
        </main>
      </div>
      <MobileNav />

      {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

      {showNewOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-sm rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Nouvelle commande</h2>
              <button
                onClick={() => setShowNewOrder(false)}
                aria-label="Fermer"
                className="grid size-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Cette fonctionnalité sera connectée au backend dans une prochaine étape.
            </p>
            <button
              onClick={() => setShowNewOrder(false)}
              className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
