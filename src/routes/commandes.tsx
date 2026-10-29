import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ClipboardList, Plus, Search } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/Modal";
import {
  formatDate,
  formatMoney,
  newId,
  orderStatusTone,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  stockStatus,
  useClients,
  useOrders,
  useProducts,
  useSettingsSnapshot,
  type Client,
  type Order,
  type OrderStatus,
  type PaymentStatus,
  type Product,
} from "../lib/data";
import { pushNotification } from "../lib/notifications";

export const Route = createFileRoute("/commandes")({
  head: () => ({
    meta: [
      { title: "Commandes | KOMANDA" },
      { name: "description", content: "Gérez et suivez toutes vos commandes avec KOMANDA." },
      { property: "og:title", content: "Commandes | KOMANDA" },
      { property: "og:description", content: "Gérez et suivez toutes vos commandes avec KOMANDA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommandesPage,
});

const filters = [
  "Toutes",
  "Nouvelles",
  "Confirmées",
  "En préparation",
  "En livraison",
  "Livrées",
  "Annulées",
];

const filterToStatus: Record<string, OrderStatus> = {
  Nouvelles: "Nouvelle",
  Confirmées: "Confirmée",
  "En préparation": "En préparation",
  "En livraison": "En livraison",
  Livrées: "Livrée",
  Annulées: "Annulée",
};

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40";

type NewOrderInput = {
  client: Client;
  product: Product;
  quantity: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  address: string;
};

function NewOrderForm({
  clients,
  products,
  currency,
  onSave,
  onClose,
}: {
  clients: Client[];
  products: Product[];
  currency: string;
  onSave: (input: NewOrderInput) => void;
  onClose: () => void;
}) {
  const available = products.filter((p) => p.stock > 0);
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("En attente");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  if (clients.length === 0 || available.length === 0) {
    return (
      <Modal title="Nouvelle commande" onClose={onClose} maxWidth="max-w-sm">
        <p className="text-sm text-muted-foreground">
          {clients.length === 0
            ? "Pour créer une commande, ajoutez d'abord au moins un client."
            : "Pour créer une commande, ajoutez d'abord un produit en stock."}
        </p>
        <Link
          to={clients.length === 0 ? "/clients" : "/produits"}
          className="mt-5 block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {clients.length === 0 ? "Aller aux clients" : "Aller aux produits"}
        </Link>
      </Modal>
    );
  }

  const selectedProduct = available.find((p) => p.id === productId);
  const parsedQuantity = Number(quantity);
  const total =
    selectedProduct && Number.isInteger(parsedQuantity) && parsedQuantity > 0
      ? selectedProduct.price * parsedQuantity
      : 0;

  const handleClientChange = (id: string) => {
    setClientId(id);
    setAddress(clients.find((c) => c.id === id)?.address ?? "");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return setError("Choisissez un client.");
    if (!selectedProduct) return setError("Choisissez un produit.");
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1)
      return setError("La quantité doit être un nombre entier, 1 ou plus.");
    if (parsedQuantity > selectedProduct.stock)
      return setError(`Il ne reste que ${selectedProduct.stock} unité(s) en stock pour ce produit.`);
    onSave({
      client,
      product: selectedProduct,
      quantity: parsedQuantity,
      paymentMethod,
      paymentStatus,
      address: address.trim(),
    });
  };

  return (
    <Modal title="Nouvelle commande" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="order-client" className="text-xs font-medium text-muted-foreground">
            Client
          </label>
          <select
            id="order-client"
            value={clientId}
            onChange={(e) => handleClientChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Choisir un client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="order-product" className="text-xs font-medium text-muted-foreground">
            Produit
          </label>
          <select
            id="order-product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={inputClass}
          >
            <option value="">Choisir un produit</option>
            {available.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatMoney(p.price, currency)} ({p.stock} en stock)
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="order-quantity" className="text-xs font-medium text-muted-foreground">
              Quantité
            </label>
            <input
              id="order-quantity"
              type="text"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Montant</span>
            <p className="rounded-lg bg-muted/70 px-3 py-2.5 text-sm font-semibold tabular-nums">
              {formatMoney(total, currency)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="order-method" className="text-xs font-medium text-muted-foreground">
              Mode de paiement
            </label>
            <select
              id="order-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={inputClass}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="order-payment" className="text-xs font-medium text-muted-foreground">
              Paiement
            </label>
            <select
              id="order-payment"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className={inputClass}
            >
              <option value="En attente">En attente</option>
              <option value="Payée">Payée</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="order-address" className="text-xs font-medium text-muted-foreground">
            Adresse de livraison (facultatif)
          </label>
          <input
            id="order-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-warning">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Créer la commande
          </button>
        </div>
      </form>
    </Modal>
  );
}

function OrderDetail({
  order,
  currency,
  onStatusChange,
  onPaymentChange,
  onClose,
}: {
  order: Order;
  currency: string;
  onStatusChange: (status: OrderStatus) => void;
  onPaymentChange: (status: PaymentStatus) => void;
  onClose: () => void;
}) {
  const cancelled = order.status === "Annulée";
  const tone = orderStatusTone(order.status);

  return (
    <Modal title={`Commande #${order.number}`} onClose={onClose}>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Client</span>
          <span className="font-medium">{order.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Produit</span>
          <span className="font-medium">{order.productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quantité</span>
          <span className="font-medium">{order.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Montant</span>
          <span className="font-semibold tabular-nums">{formatMoney(order.amount, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mode de paiement</span>
          <span className="font-medium">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Adresse</span>
          <span className="max-w-[55%] text-right font-medium">{order.address || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Statut actuel</span>
          <span className={`status-badge status-${tone}`}>
            {tone === "success" && <CheckCircle2 className="size-3" />}
            {order.status}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="detail-status" className="text-xs font-medium text-muted-foreground">
            Changer le statut
          </label>
          <select
            id="detail-status"
            value={order.status}
            disabled={cancelled}
            onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="detail-payment" className="text-xs font-medium text-muted-foreground">
            Paiement
          </label>
          <select
            id="detail-payment"
            value={order.paymentStatus}
            disabled={cancelled}
            onChange={(e) => onPaymentChange(e.target.value as PaymentStatus)}
            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="En attente">En attente</option>
            <option value="Payée">Payée</option>
          </select>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {cancelled
          ? "Cette commande est annulée : le stock a été remis à jour et elle ne peut plus être modifiée."
          : "Si vous annulez la commande, la quantité est automatiquement remise en stock."}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Fermer
      </button>
    </Modal>
  );
}

function CommandesPage() {
  const { items: orders, update: updateOrders, ready } = useOrders();
  const { items: clients } = useClients();
  const { items: products, update: updateProducts } = useProducts();
  const { currency } = useSettingsSnapshot();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedId) ?? null;

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => b.number - a.number),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sortedOrders.filter((order) => {
      const matchesSearch =
        !term ||
        `#${order.number}`.includes(term) ||
        String(order.number).includes(term) ||
        order.clientName.toLowerCase().includes(term) ||
        order.productName.toLowerCase().includes(term) ||
        String(order.amount).includes(term);
      const matchesFilter = activeFilter === "Toutes" || order.status === filterToStatus[activeFilter];
      return matchesSearch && matchesFilter;
    });
  }, [sortedOrders, search, activeFilter]);

  const handleCreate = ({ client, product, quantity, paymentMethod, paymentStatus, address }: NewOrderInput) => {
    const number = orders.reduce((max, o) => Math.max(max, o.number), 1000) + 1;
    const order: Order = {
      id: newId(),
      number,
      clientId: client.id,
      clientName: client.name,
      productId: product.id,
      productName: product.name,
      quantity,
      amount: product.price * quantity,
      status: "Nouvelle",
      paymentStatus,
      paymentMethod,
      address,
      createdAt: new Date().toISOString(),
    };
    updateOrders((list) => [order, ...list]);
    updateProducts((list) =>
      list.map((p) => (p.id === product.id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p)),
    );

    pushNotification({
      type: "Commande",
      title: `Nouvelle commande #${number}`,
      message: `${client.name} : ${quantity} × ${product.name} (${formatMoney(order.amount, currency)}).`,
      detailsTo: "/commandes",
    });
    const remaining = Math.max(0, product.stock - quantity);
    if (stockStatus({ ...product, stock: remaining }) !== "En stock") {
      pushNotification({
        type: "Stock",
        title: remaining === 0 ? "Rupture de stock" : "Stock bas",
        message:
          remaining === 0
            ? `« ${product.name} » n'est plus disponible.`
            : `Il reste ${remaining} unité(s) de « ${product.name} ».`,
        detailsTo: "/produits",
      });
    }
    setShowNewOrder(false);
  };

  const handleStatusChange = (order: Order, status: OrderStatus) => {
    if (order.status === "Annulée" || status === order.status) return;
    if (
      status === "Annulée" &&
      !window.confirm("Annuler cette commande ? La quantité sera remise en stock et la commande ne pourra plus être modifiée.")
    ) {
      return;
    }
    updateOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status } : o)));
    if (status === "Annulée") {
      updateProducts((list) =>
        list.map((p) => (p.id === order.productId ? { ...p, stock: p.stock + order.quantity } : p)),
      );
    }
  };

  const handlePaymentChange = (order: Order, paymentStatus: PaymentStatus) => {
    if (order.status === "Annulée") return;
    updateOrders((list) => list.map((o) => (o.id === order.id ? { ...o, paymentStatus } : o)));
    if (paymentStatus === "Payée" && order.paymentStatus !== "Payée") {
      pushNotification({
        type: "Paiement",
        title: "Paiement reçu",
        message: `${order.clientName} a réglé la commande #${order.number} (${formatMoney(order.amount, currency)}).`,
        detailsTo: "/ventes",
      });
    }
  };

  return (
    <AppShell active="commandes">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold leading-tight sm:text-[36px]">Commandes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez et suivez toutes vos commandes.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewOrder(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nouvelle commande
        </button>
      </header>

      <section className="content-card mb-3.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une commande ou un client..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm outline-none ring-ring transition-shadow focus:ring-2"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrer par statut">
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={active}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
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

        {ready && orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
              <ClipboardList className="size-6" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-sm font-semibold">Aucune commande pour le moment</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Créez votre première commande : le stock du produit sera mis à jour automatiquement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewOrder(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Nouvelle commande
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {filteredOrders.map((order) => {
              const tone = orderStatusTone(order.status);
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[80px_1fr_140px_120px_70px]"
                >
                  <p className="text-sm font-semibold text-primary">#{order.number}</p>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{order.clientName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.productName}
                      {order.quantity > 1 ? ` (x${order.quantity})` : ""}
                    </p>
                  </div>
                  <div className="order-4 sm:order-none sm:text-right">
                    <p className="text-sm font-semibold tabular-nums">{formatMoney(order.amount, currency)}</p>
                    <p className="text-[11px] text-muted-foreground">{order.paymentStatus}</p>
                  </div>
                  <span className={`status-badge status-${tone}`}>
                    {tone === "success" && <CheckCircle2 className="size-3" />}
                    {order.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedId(order.id)}
                    className="order-5 justify-self-start rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:order-none sm:justify-self-end"
                  >
                    Voir
                  </button>
                </div>
              );
            })}
            {ready && filteredOrders.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune commande ne correspond à votre recherche.
              </p>
            )}
          </div>
        )}
      </section>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          currency={currency}
          onStatusChange={(status) => handleStatusChange(selectedOrder, status)}
          onPaymentChange={(status) => handlePaymentChange(selectedOrder, status)}
          onClose={() => setSelectedId(null)}
        />
      )}

      {showNewOrder && (
        <NewOrderForm
          clients={clients}
          products={products}
          currency={currency}
          onSave={handleCreate}
          onClose={() => setShowNewOrder(false)}
        />
      )}
    </AppShell>
  );
}
