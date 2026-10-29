import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/Modal";
import {
  formatDate,
  formatMoney,
  newId,
  useClients,
  useOrders,
  useSettingsSnapshot,
  type Client,
  type Order,
} from "../lib/data";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients | KOMANDA" },
      { name: "description", content: "Retrouvez et gérez vos clients avec KOMANDA." },
      { property: "og:title", content: "Clients | KOMANDA" },
      { property: "og:description", content: "Retrouvez et gérez vos clients avec KOMANDA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientsPage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40";

type ClientInput = Omit<Client, "id" | "createdAt">;

function clientStats(client: Client, orders: Order[]) {
  const mine = orders
    .filter((order) => order.clientId === client.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const valid = mine.filter((order) => order.status !== "Annulée");
  const total = valid.reduce((sum, order) => sum + order.amount, 0);
  return { history: mine, count: valid.length, total, last: mine[0] };
}

function ClientForm({
  client,
  onSave,
  onClose,
}: {
  client: Client | null;
  onSave: (input: ClientInput) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(client?.name ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [address, setAddress] = useState(client?.address ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError("Indiquez le nom du client.");
    onSave({ name: name.trim(), phone: phone.trim(), email: email.trim(), address: address.trim() });
  };

  return (
    <Modal title={client ? "Modifier le client" : "Ajouter un client"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-name" className="text-xs font-medium text-muted-foreground">
            Nom
          </label>
          <input
            id="client-name"
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Sarah M."
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-phone" className="text-xs font-medium text-muted-foreground">
            Téléphone
          </label>
          <input
            id="client-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+243 8X XXX XXXX"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-email" className="text-xs font-medium text-muted-foreground">
            Email (facultatif)
          </label>
          <input
            id="client-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client-address" className="text-xs font-medium text-muted-foreground">
            Adresse de livraison (facultatif)
          </label>
          <input
            id="client-address"
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
            {client ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ClientDetail({
  client,
  orders,
  currency,
  onEdit,
  onDelete,
  onClose,
}: {
  client: Client;
  orders: Order[];
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const { history, count, total } = clientStats(client, orders);
  const average = count > 0 ? Math.round(total / count) : 0;

  return (
    <Modal title="Fiche client" onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-semibold text-primary">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-base font-semibold">{client.name}</p>
          <p className="text-xs text-muted-foreground">{client.phone || "Téléphone non renseigné"}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{client.email || "—"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Adresse</span>
          <span className="max-w-[55%] text-right font-medium">{client.address || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Commandes</span>
          <span className="font-semibold">{count}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total dépensé</span>
          <span className="font-semibold tabular-nums">{formatMoney(total, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Panier moyen</span>
          <span className="font-semibold tabular-nums">{formatMoney(average, currency)}</span>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Historique des commandes</h3>
        {history.length === 0 ? (
          <p className="rounded-lg bg-muted/70 p-3 text-sm text-muted-foreground">
            Ce client n'a pas encore passé de commande.
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 p-2.5 text-sm"
              >
                <div>
                  <p className="font-medium">
                    #{order.number}
                    {order.status === "Annulée" && (
                      <span className="ml-2 text-[11px] font-normal text-muted-foreground">annulée</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.productName}
                    {order.quantity > 1 ? ` (x${order.quantity})` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">{formatMoney(order.amount, currency)}</p>
                  <p className="text-[10px] text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Trash2 className="size-4" />
          Supprimer
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Pencil className="size-4" />
          Modifier
        </button>
      </div>
    </Modal>
  );
}

function ClientsPage() {
  const { items: clients, update, ready } = useClients();
  const { items: orders } = useOrders();
  const { currency } = useSettingsSnapshot();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Client | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Client | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedId) ?? null;

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter(
      (client) =>
        !term ||
        client.name.toLowerCase().includes(term) ||
        client.phone.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term),
    );
  }, [clients, search]);

  const handleSave = (input: ClientInput) => {
    if (editing && editing !== "new") {
      const id = editing.id;
      update((list) => list.map((c) => (c.id === id ? { ...c, ...input } : c)));
    } else {
      const id = newId();
      update((list) => [{ ...input, id, createdAt: new Date().toISOString() }, ...list]);
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    const id = toDelete.id;
    update((list) => list.filter((c) => c.id !== id));
    setToDelete(null);
    setSelectedId(null);
  };

  return (
    <AppShell active="clients">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold leading-tight sm:text-[36px]">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">Retrouvez et gérez vos clients.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Ajouter un client
        </button>
      </header>

      <section className="content-card mb-3.5">
        <div className="relative">
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

        {ready && clients.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
              <Users className="size-6" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-sm font-semibold">Aucun client pour le moment</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Ajoutez vos clients pour leur associer des commandes et suivre ce qu'ils achètent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing("new")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Ajouter un client
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {filteredClients.map((client) => {
              const { count, total, last } = clientStats(client, orders);
              return (
                <div
                  key={client.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 py-3.5 sm:grid-cols-[1fr_150px_120px_140px_80px] sm:gap-x-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold text-primary">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{client.name}</p>
                      <p className="truncate text-xs text-muted-foreground sm:hidden">
                        {client.phone || "Téléphone non renseigné"}
                      </p>
                    </div>
                  </div>
                  <p className="hidden truncate text-sm text-muted-foreground sm:block">{client.phone || "—"}</p>
                  <p className="hidden text-center text-sm font-semibold sm:block">{count} commande(s)</p>
                  <p className="hidden text-right text-sm font-semibold tabular-nums sm:block">
                    {formatMoney(total, currency)}
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedId(client.id)}
                      className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Voir
                    </button>
                  </div>
                  <p className="col-span-2 text-[11px] text-muted-foreground sm:col-span-5">
                    {last
                      ? `Dernière commande : #${last.number} — ${last.productName} — ${formatMoney(last.amount, currency)}`
                      : "Aucune commande"}
                    <span className="sm:hidden">
                      {" "}
                      · {count} cmd · {formatMoney(total, currency)}
                    </span>
                  </p>
                </div>
              );
            })}
            {ready && filteredClients.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucun client ne correspond à votre recherche.
              </p>
            )}
          </div>
        )}
      </section>

      {selectedClient && !editing && !toDelete && (
        <ClientDetail
          client={selectedClient}
          orders={orders}
          currency={currency}
          onEdit={() => setEditing(selectedClient)}
          onDelete={() => setToDelete(selectedClient)}
          onClose={() => setSelectedId(null)}
        />
      )}

      {editing && (
        <ClientForm
          client={editing === "new" ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {toDelete && (
        <Modal title="Supprimer ce client ?" onClose={() => setToDelete(null)} maxWidth="max-w-sm">
          <p className="text-sm text-muted-foreground">
            « {toDelete.name} » sera retiré de votre liste. Ses commandes passées sont conservées dans
            l'historique des ventes.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setToDelete(null)}
              className="flex-1 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Supprimer
            </button>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}
