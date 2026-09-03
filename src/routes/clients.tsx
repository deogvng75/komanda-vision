import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ClipboardList,
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

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients | KOMANDA" },
      {
        name: "description",
        content: "Retrouvez et gérez vos clients avec KOMANDA.",
      },
      { property: "og:title", content: "Clients | KOMANDA" },
      {
        property: "og:description",
        content: "Retrouvez et gérez vos clients avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientsPage,
});

const navigation = [
  { label: "Dashboard", icon: Gauge, to: "/" },
  { label: "Commandes", icon: ClipboardList, to: "/commandes" },
  { label: "Clients", icon: Users, active: true, to: "/clients" },
  { label: "Produits", icon: Package, to: "/produits" },
  { label: "Ventes", icon: TrendingUp },
  { label: "Notifications", icon: Bell },
  { label: "Paramètres", icon: Settings },
];

const clients = [
  {
    id: "c1",
    name: "Sarah M.",
    phone: "+243 81 234 5678",
    email: "sarah.m@email.cd",
    address: "12 Av. de la Justice, Kinshasa",
    orders: 8,
    total: 245000,
    lastOrder: "#1052 — Robe Élégance — 28 000 CDF",
    history: [
      { id: "#1052", product: "Robe Élégance", amount: 28000, date: "02 sept. 2026" },
      { id: "#1041", product: "Talons Nude", amount: 45000, date: "28 août 2026" },
      { id: "#1033", product: "Sac Bandoulière", amount: 52000, date: "15 août 2026" },
      { id: "#1025", product: "Boucles d'oreilles", amount: 18000, date: "03 août 2026" },
    ],
  },
  {
    id: "c2",
    name: "David K.",
    phone: "+243 82 345 6789",
    email: "david.k@email.cd",
    address: "45 Blvd du 30 Juin, Kinshasa",
    orders: 5,
    total: 180000,
    lastOrder: "#1051 — Sneakers Classic — 60 000 CDF",
    history: [
      { id: "#1051", product: "Sneakers Classic", amount: 60000, date: "01 sept. 2026" },
      { id: "#1039", product: "T-shirt Premium", amount: 35000, date: "22 août 2026" },
      { id: "#1028", product: "Casquette Urbaine", amount: 25000, date: "10 août 2026" },
    ],
  },
  {
    id: "c3",
    name: "Marie L.",
    phone: "+243 83 456 7890",
    email: "marie.l@email.cd",
    address: "78 Av. Kasa-Vubu, Kinshasa",
    orders: 12,
    total: 420000,
    lastOrder: "#1050 — Sac Milano — 45 000 CDF",
    history: [
      { id: "#1050", product: "Sac Milano", amount: 45000, date: "31 août 2026" },
      { id: "#1045", product: "Robe Cocktail", amount: 68000, date: "25 août 2026" },
      { id: "#1036", product: "Chaussures Cuir", amount: 75000, date: "18 août 2026" },
      { id: "#1022", product: "Ceinture Classique", amount: 32000, date: "05 août 2026" },
    ],
  },
  {
    id: "c4",
    name: "Alice P.",
    phone: "+243 84 567 8901",
    email: "alice.p@email.cd",
    address: "21 Rue de l'Espoir, Kinshasa",
    orders: 3,
    total: 95000,
    lastOrder: "#1049 — Parfum Signature — 35 000 CDF",
    history: [
      { id: "#1049", product: "Parfum Signature (x2)", amount: 35000, date: "30 août 2026" },
      { id: "#1030", product: "Crème Visage", amount: 30000, date: "12 août 2026" },
      { id: "#1015", product: "Huile Corporelle", amount: 30000, date: "20 juil. 2026" },
    ],
  },
  {
    id: "c5",
    name: "Kevin B.",
    phone: "+243 85 678 9012",
    email: "kevin.b@email.cd",
    address: "9 Blvd Lumumba, Kinshasa",
    orders: 7,
    total: 310000,
    lastOrder: "#1048 — Montre Prestige — 75 000 CDF",
    history: [
      { id: "#1048", product: "Montre Prestige", amount: 75000, date: "29 août 2026" },
      { id: "#1042", product: "Portefeuille Cuir", amount: 55000, date: "24 août 2026" },
      { id: "#1035", product: "Lunettes Soleil", amount: 80000, date: "17 août 2026" },
      { id: "#1018", product: "Bracelet Argent", amount: 50000, date: "01 août 2026" },
    ],
  },
];

function formatCurrency(value: number) {
  return `${value.toLocaleString("fr-FR")} CDF`;
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

function ClientDetail({
  client,
  onClose,
}: {
  client: (typeof clients)[number];
  onClose: () => void;
}) {
  const average = Math.round(client.total / client.orders);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Fiche client</h2>
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
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-semibold text-primary">
              {client.name.charAt(0)}
            </div>
            <div>
              <p className="font-display text-base font-semibold">{client.name}</p>
              <p className="text-xs text-muted-foreground">{client.phone}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{client.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Adresse</span>
              <span className="max-w-[55%] text-right font-medium">{client.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commandes</span>
              <span className="font-semibold">{client.orders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total dépensé</span>
              <span className="font-semibold tabular-nums">{formatCurrency(client.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Panier moyen</span>
              <span className="font-semibold tabular-nums">{formatCurrency(average)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dernière commande</span>
              <span className="max-w-[55%] text-right text-xs font-medium">{client.lastOrder}</span>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Historique des commandes
            </h3>
            <div className="space-y-2">
              {client.history.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 p-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">{formatCurrency(order.amount)}</p>
                    <p className="text-[10px] text-muted-foreground">{order.date}</p>
                  </div>
                </div>
              ))}
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

function ClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<(typeof clients)[number] | null>(null);
  const [showNewClient, setShowNewClient] = useState(false);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.phone.includes(term) ||
        client.email.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      <MobileHeader />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
                Clients
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Retrouvez et gérez vos clients.</p>
            </div>
            <button
              onClick={() => setShowNewClient(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Ajouter un client
            </button>
          </header>

          <section className="content-card mb-3.5">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un client..."
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm outline-none ring-ring transition-shadow focus:ring-2"
              />
            </div>
          </section>

          <section className="content-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="section-title">Liste des clients</h2>
              <span className="text-xs font-semibold text-primary">{filteredClients.length} client(s)</span>
            </div>
            <div className="divide-y divide-border/70">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[1fr_140px_140px_140px_90px]"
                >
                  <div className="flex items-center gap-3 sm:col-span-1">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold text-primary">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{client.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{client.phone}</p>
                    </div>
                  </div>
                  <p className="hidden text-sm text-muted-foreground sm:block">{client.phone}</p>
                  <p className="hidden text-center text-sm font-semibold sm:block">{client.orders} commandes</p>
                  <p className="hidden text-right text-sm font-semibold tabular-nums sm:block">
                    {formatCurrency(client.total)}
                  </p>
                  <div className="flex flex-col items-end gap-1 sm:items-center">
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {client.orders} cmd · {formatCurrency(client.total)}
                    </p>
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      Voir
                    </button>
                  </div>
                  <p className="col-span-3 text-[11px] text-muted-foreground sm:col-span-5">
                    Dernière commande : {client.lastOrder}
                  </p>
                </div>
              ))}
              {filteredClients.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">Aucun client ne correspond à votre recherche.</div>
              )}
            </div>
          </section>
        </main>
      </div>
      <MobileNav />

      {selectedClient && <ClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} />}

      {showNewClient && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-sm rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Ajouter un client</h2>
              <button
                onClick={() => setShowNewClient(false)}
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
              onClick={() => setShowNewClient(false)}
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
