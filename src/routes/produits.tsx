import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Box,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Tag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import marieAvatar from "../assets/marie-avatar.jpg";

export const Route = createFileRoute("/produits")({
  head: () => ({
    meta: [
      { title: "Produits | KOMANDA" },
      {
        name: "description",
        content: "Gérez votre catalogue et votre stock avec KOMANDA.",
      },
      { property: "og:title", content: "Produits | KOMANDA" },
      {
        property: "og:description",
        content: "Gérez votre catalogue et votre stock avec KOMANDA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProduitsPage,
});

const navigation = [
  { label: "Dashboard", icon: Gauge, to: "/" },
  { label: "Commandes", icon: ClipboardList, to: "/commandes" },
  { label: "Clients", icon: Users, to: "/clients" },
  { label: "Produits", icon: Package, active: true, to: "/produits" },
  { label: "Ventes", icon: TrendingUp, to: "/ventes" },
  { label: "Notifications", icon: Bell },
  { label: "Paramètres", icon: Settings },
];

const categories = ["Toutes", "Vêtements", "Chaussures", "Accessoires", "Beauté"];

const initialProducts = [
  {
    id: "p1",
    name: "Robe Élégance",
    price: 35000,
    stock: 17,
    category: "Vêtements",
    threshold: 5,
    description: "Robe chic et légère, idéale pour les soirées et les cérémonies.",
  },
  {
    id: "p2",
    name: "Sneakers Classic",
    price: 60000,
    stock: 12,
    category: "Chaussures",
    threshold: 5,
    description: "Baskets intemporelles alliant confort et style urbain.",
  },
  {
    id: "p3",
    name: "Sac Milano",
    price: 45000,
    stock: 8,
    category: "Accessoires",
    threshold: 3,
    description: "Sac à main élégant avec finitions soignées et grande contenance.",
  },
  {
    id: "p4",
    name: "Montre Prestige",
    price: 75000,
    stock: 4,
    category: "Accessoires",
    threshold: 2,
    description: "Montre sophistiquée pour un look professionnel et raffiné.",
  },
  {
    id: "p5",
    name: "Parfum Signature",
    price: 35000,
    stock: 3,
    category: "Beauté",
    threshold: 2,
    description: "Eau de parfum envoûtante aux notes florales et boisées.",
  },
];

function formatCurrency(value: number) {
  return `${value.toLocaleString("fr-FR")} CDF`;
}

function stockStatus(stock: number) {
  if (stock === 0) return { label: "Rupture", tone: "danger" };
  if (stock < 10) return { label: "Stock faible", tone: "warning" };
  return { label: "En stock", tone: "success" };
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

function ProductDetail({
  product,
  onClose,
}: {
  product: (typeof initialProducts)[number];
  onClose: () => void;
}) {
  const status = stockStatus(product.stock);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Détail produit</h2>
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
              <Package className="size-6" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-display text-base font-semibold">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prix</span>
              <span className="font-semibold tabular-nums">{formatCurrency(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Catégorie</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock disponible</span>
              <span className="font-semibold">{product.stock}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seuil d'alerte</span>
              <span className="font-medium">{product.threshold}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut</span>
              <span className={`status-badge status-${status.tone}`}>
                {status.tone === "success" && <CheckCircle2 className="size-3" />}
                {status.label}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Description</span>
              <p className="mt-1 font-medium leading-relaxed">{product.description}</p>
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

function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (product: (typeof initialProducts)[number]) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Vêtements",
    stock: "",
    threshold: "",
    description: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: `p${Date.now()}`,
      name: form.name.trim(),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      category: form.category,
      threshold: Number(form.threshold) || 0,
      description: form.description.trim(),
    };
    onAdd(newProduct);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-2xl border border-border/70 bg-card p-5 shadow-float backdrop-blur-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Ajouter un produit</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 grid size-14 place-items-center rounded-full bg-secondary text-success">
              <CheckCircle2 className="size-7" />
            </div>
            <p className="font-display text-base font-semibold">Produit ajouté avec succès</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto pr-1">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Nom</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nom du produit"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Prix en CDF</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Ex. 35000"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Catégorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                >
                  {categories.slice(1).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Quantité en stock</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="Ex. 10"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Seuil d'alerte</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.threshold}
                    onChange={(e) => setForm({ ...form, threshold: e.target.value })}
                    placeholder="Ex. 3"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez le produit..."
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Ajouter le produit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ProduitsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<(typeof initialProducts)[number] | null>(null);
  const [showNewProduct, setShowNewProduct] = useState(false);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.price.toString().includes(term);
      const matchesCategory = activeCategory === "Toutes" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, products]);

  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      <MobileHeader />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">
                Produits
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Gérez votre catalogue et votre stock.</p>
            </div>
            <button
              onClick={() => setShowNewProduct(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-brand transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Ajouter un produit
            </button>
          </header>

          <section className="content-card mb-3.5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                />
              </div>
              <div className="relative sm:w-48">
                <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-input bg-background py-2.5 pl-9 pr-8 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = category === activeCategory;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="content-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="section-title">Catalogue</h2>
              <span className="text-xs font-semibold text-primary">{filteredProducts.length} produit(s)</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const status = stockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between rounded-xl border border-border/70 bg-background/60 p-4 transition-colors hover:bg-background"
                  >
                    <div>
                      <div className="mb-3 flex items-start justify-between">
                        <div className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                          <ShoppingBag className="size-5" strokeWidth={1.8} />
                        </div>
                        <span className={`status-badge status-${status.tone}`}>
                          {status.tone === "success" && <CheckCircle2 className="size-3" />}
                          {status.label}
                        </span>
                      </div>
                      <p className="font-display text-base font-semibold">{product.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div>
                        <p className="font-display text-lg font-semibold tabular-nums">{formatCurrency(product.price)}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Box className="size-3" />
                          Stock : {product.stock}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  Aucun produit ne correspond à votre recherche.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <MobileNav />

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {showNewProduct && (
        <AddProductModal
          onClose={() => setShowNewProduct(false)}
          onAdd={(product) => setProducts((prev) => [product, ...prev])}
        />
      )}
    </div>
  );
}
