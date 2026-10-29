import { createFileRoute } from "@tanstack/react-router";
import { Box, CircleDollarSign, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/Modal";
import {
  formatMoney,
  newId,
  stockStatus,
  stockTone,
  useProducts,
  useSettingsSnapshot,
  type Product,
} from "../lib/data";

export const Route = createFileRoute("/produits")({
  head: () => ({
    meta: [
      { title: "Produits | KOMANDA" },
      {
        name: "description",
        content: "Gérez votre catalogue et suivez votre stock avec KOMANDA.",
      },
      { property: "og:title", content: "Produits | KOMANDA" },
      {
        property: "og:description",
        content: "Gérez votre catalogue et suivez votre stock avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProduitsPage,
});

const filters = ["Tous", "Stock bas", "Rupture"] as const;
type Filter = (typeof filters)[number];

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40";

type ProductInput = Omit<Product, "id" | "createdAt">;

function ProductForm({
  product,
  categories,
  currency,
  onSave,
  onClose,
}: {
  product: Product | null;
  categories: string[];
  currency: string;
  onSave: (input: ProductInput) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [threshold, setThreshold] = useState(product ? String(product.lowStockThreshold) : "5");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const parsedPrice = Number(price.replace(",", "."));
    const parsedStock = Number(stock);
    const parsedThreshold = Number(threshold);

    if (!name.trim()) return setError("Donnez un nom au produit.");
    if (price.trim() === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0)
      return setError("Le prix doit être un nombre positif.");
    if (stock.trim() === "" || !Number.isInteger(parsedStock) || parsedStock < 0)
      return setError("Le stock doit être un nombre entier, 0 ou plus.");
    if (threshold.trim() === "" || !Number.isInteger(parsedThreshold) || parsedThreshold < 0)
      return setError("Le seuil d'alerte doit être un nombre entier, 0 ou plus.");

    onSave({
      name: name.trim(),
      category: category.trim(),
      price: parsedPrice,
      stock: parsedStock,
      lowStockThreshold: parsedThreshold,
    });
  };

  return (
    <Modal title={product ? "Modifier le produit" : "Ajouter un produit"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product-name" className="text-xs font-medium text-muted-foreground">
            Nom du produit
          </label>
          <input
            id="product-name"
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Robe Élégance"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product-category" className="text-xs font-medium text-muted-foreground">
            Catégorie (facultatif)
          </label>
          <input
            id="product-category"
            type="text"
            list="product-categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex. Vêtements"
            className={inputClass}
          />
          <datalist id="product-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-price" className="text-xs font-medium text-muted-foreground">
              Prix ({currency})
            </label>
            <input
              id="product-price"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="28000"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-stock" className="text-xs font-medium text-muted-foreground">
              Quantité en stock
            </label>
            <input
              id="product-stock"
              type="text"
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product-threshold" className="text-xs font-medium text-muted-foreground">
            Alerte « stock bas » à partir de
          </label>
          <input
            id="product-threshold"
            type="text"
            inputMode="numeric"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
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
            {product ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ProduitsPage() {
  const { items: products, update, ready } = useProducts();
  const { currency } = useSettingsSnapshot();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Tous");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      const status = stockStatus(product);
      const matchesFilter = filter === "Tous" || status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const stockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => stockStatus(p) !== "En stock").length;

  const summary = [
    { label: "Produits", value: String(products.length), detail: "Dans votre catalogue", icon: Package },
    { label: "Valeur du stock", value: formatMoney(stockValue, currency), detail: "Prix × quantité", icon: CircleDollarSign },
    {
      label: "À réapprovisionner",
      value: String(lowStockCount),
      detail: "Stock bas ou en rupture",
      icon: Box,
    },
  ];

  const handleSave = (input: ProductInput) => {
    if (editing && editing !== "new") {
      const id = editing.id;
      update((list) => list.map((p) => (p.id === id ? { ...p, ...input } : p)));
    } else {
      update((list) => [{ ...input, id: newId(), createdAt: new Date().toISOString() }, ...list]);
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    const id = toDelete.id;
    update((list) => list.filter((p) => p.id !== id));
    setToDelete(null);
  };

  return (
    <AppShell active="produits">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold leading-tight sm:text-[36px]">Produits</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez votre catalogue et suivez votre stock.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Ajouter un produit
        </button>
      </header>

      <section aria-label="Indicateurs de stock" className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit ou une catégorie..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm outline-none ring-ring transition-shadow focus:ring-2"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrer par état du stock">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="content-card mt-3.5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Liste des produits</h2>
          <span className="text-xs font-semibold text-primary">{filteredProducts.length} produit(s)</span>
        </div>

        {ready && products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
              <Package className="size-6" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-sm font-semibold">Aucun produit pour le moment</p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Ajoutez votre premier produit avec son prix et sa quantité en stock. KOMANDA vous préviendra
                quand il sera bientôt épuisé.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing("new")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {filteredProducts.map((product) => {
              const status = stockStatus(product);
              return (
                <div
                  key={product.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[1fr_130px_100px_110px_auto] sm:gap-x-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category || "Sans catégorie"}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums sm:text-right">
                    {formatMoney(product.price, currency)}
                  </p>
                  <p className="text-sm tabular-nums text-muted-foreground sm:text-center">
                    {product.stock} en stock
                  </p>
                  <span className={`status-badge status-${stockTone(status)}`}>{status}</span>
                  <div className="col-span-2 flex justify-end gap-2 sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => setEditing(product)}
                      aria-label={`Modifier ${product.name}`}
                      className="grid size-8 place-items-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(product)}
                      aria-label={`Supprimer ${product.name}`}
                      className="grid size-8 place-items-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {ready && filteredProducts.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucun produit ne correspond à votre recherche.
              </p>
            )}
          </div>
        )}
      </section>

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          categories={categories}
          currency={currency}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {toDelete && (
        <Modal title="Supprimer ce produit ?" onClose={() => setToDelete(null)} maxWidth="max-w-sm">
          <p className="text-sm text-muted-foreground">
            « {toDelete.name} » sera retiré de votre catalogue. Cette action est définitive.
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
