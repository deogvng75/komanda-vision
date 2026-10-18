import { createFileRoute, Link } from "@tanstack/react-router";
import { useUnreadNotifications } from "../lib/notifications";
import {
  Bell,
  Box,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Gauge,
  Hand,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import marieAvatar from "../assets/marie-avatar.jpg";

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

const navigation = [
  { label: "Dashboard", icon: Gauge, active: true, to: "/" },
  { label: "Commandes", icon: ClipboardList, to: "/commandes" },
  { label: "Clients", icon: Users, to: "/clients" },
  { label: "Produits", icon: Package, to: "/produits" },
  { label: "Ventes", icon: TrendingUp, to: "/ventes" },
  { label: "Notifications", icon: Bell, to: "/notifications" },
  { label: "Paramètres", icon: Settings },
];

const stats = [
  { label: "CA aujourd'hui", value: "125 000 CDF", detail: "+12,5 %", icon: CircleDollarSign, positive: true },
  { label: "CA du mois", value: "2 450 000 CDF", detail: "+8,2 %", icon: TrendingUp, positive: true },
  { label: "Commandes", value: "87", detail: "+14 cette semaine", icon: ShoppingBag, positive: true },
  { label: "À traiter", value: "12", detail: "Nécessitent une action", icon: ClipboardList, positive: false },
];

const sales = [
  { day: "Lun", value: 38 }, { day: "Mar", value: 55 }, { day: "Mer", value: 47 },
  { day: "Jeu", value: 72 }, { day: "Ven", value: 63 }, { day: "Sam", value: 94 },
  { day: "Dim", value: 81 },
];

const orders = [
  { id: "#1052", customer: "Sarah M.", amount: "28 000 CDF", status: "Confirmée", tone: "success" },
  { id: "#1051", customer: "David K.", amount: "60 000 CDF", status: "En livraison", tone: "info" },
  { id: "#1050", customer: "Marie L.", amount: "45 000 CDF", status: "Livrée", tone: "neutral" },
  { id: "#1049", customer: "Alice P.", amount: "35 000 CDF", status: "Nouvelle", tone: "warning" },
];

const tasks = [
  { count: 5, label: "commandes à confirmer", icon: ClipboardList },
  { count: 3, label: "paiements en attente", icon: CircleDollarSign },
  { count: 7, label: "produits bientôt en rupture", icon: Box },
];

function BrandMark() {
  return <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground shadow-brand">K</div>;
}

function Sidebar() {
  const unreadNotifications = useUnreadNotifications();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/70 bg-sidebar/72 px-5 py-6 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2.5 px-1">
        <BrandMark />
        <div><p className="font-display text-[15px] font-semibold leading-none">KOMANDA</p><p className="mt-1 text-[11px] text-muted-foreground">Le copilote commercial</p></div>
      </div>
      <nav aria-label="Navigation principale" className="mt-8 flex flex-col gap-1">
        {navigation.map(({ label, icon: Icon, active, to }) => {
          const className = active ? "nav-item-active" : "nav-item";
          const content = (
            <>
              <Icon className="size-[17px]" strokeWidth={1.8} /><span>{label}</span>
              {label === "Commandes" && <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">12</span>}
              {label === "Notifications" && unreadNotifications > 0 && <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">{unreadNotifications}</span>}
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
        <img src={marieAvatar} alt="Marie, propriétaire de Boutique Marie" width={512} height={512} loading="lazy" className="size-10 rounded-full object-cover" />
        <div className="min-w-0"><p className="truncate text-sm font-semibold">Boutique Marie</p><p className="truncate text-[11px] text-muted-foreground">Marie D.</p></div>
        <span className="ml-auto size-2 rounded-full bg-success" aria-label="En ligne" />
      </div>
    </aside>
  );
}

function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-2.5"><BrandMark /><span className="font-display font-semibold">KOMANDA</span></div>
      <div className="flex items-center gap-2">
        <Link to="/notifications" aria-label="Notifications" className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground"><Bell className="size-[17px]" /></Link>
        <img src={marieAvatar} alt="Marie" width={512} height={512} className="size-9 rounded-full object-cover" />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <nav aria-label="Navigation mobile" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-xl border border-border/80 bg-card/92 px-1 py-1.5 shadow-float backdrop-blur-xl lg:hidden">
      {navigation.slice(0, 5).map(({ label, icon: Icon, active, to }) => {
        const className = `flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[9px] font-medium ${active ? "bg-secondary text-primary" : "text-muted-foreground"}`;
        const content = (
          <>
            <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} /><span>{label}</span>
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

function Dashboard() {
  return (
    <div className="dashboard-canvas min-h-screen bg-background font-sans text-foreground antialiased">
      <MobileHeader />
      <div className="mx-auto flex max-w-[1440px]"><Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-7 sm:pt-8 lg:px-8 lg:pb-10">
          <header className="mb-6">
            <h1 className="flex items-center gap-2 font-display text-[30px] font-semibold leading-tight sm:text-[36px]">Bonjour, Marie <Hand aria-hidden="true" className="size-7 text-warning sm:size-8" strokeWidth={1.8} /></h1>
            <p className="mt-1 text-sm text-muted-foreground">Voici ce qui se passe dans votre boutique aujourd'hui.</p>
          </header>

          <section aria-label="Indicateurs clés" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, detail, icon: Icon, positive }, index) => (
              <article key={label} className="metric-card" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex items-center justify-between"><p className="text-xs font-medium text-muted-foreground">{label}</p><span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary"><Icon className="size-4" strokeWidth={1.8} /></span></div>
                <p className="mt-3 font-display text-[25px] font-semibold tabular-nums">{value}</p>
                <p className={`mt-1.5 text-xs font-medium ${positive ? "text-success" : "text-muted-foreground"}`}>{positive && "↑ "}{detail}</p>
              </article>
            ))}
          </section>

          <section className="mt-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-3">
            <article className="content-card lg:col-span-2">
              <div className="mb-5 flex items-start justify-between"><div><h2 className="section-title">Évolution des ventes</h2><p className="mt-0.5 text-xs text-muted-foreground">7 derniers jours · 560 000 CDF</p></div><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-success">↑ 9,1 %</span></div>
              <div className="flex h-48 items-end justify-between gap-2 sm:gap-3" aria-label="Graphique des ventes des sept derniers jours">
                {sales.map(({ day, value }, index) => <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex w-full flex-1 items-end"><div className={`sales-bar ${index === sales.length - 1 ? "sales-bar-current" : ""}`} style={{ height: `${value}%`, animationDelay: `${280 + index * 45}ms` }} /></div><span className={`text-[10px] sm:text-[11px] ${index === sales.length - 1 ? "font-semibold text-primary" : "text-muted-foreground"}`}>{day}</span></div>)}
              </div>
            </article>
            <article className="content-card">
              <div className="mb-4 flex items-center justify-between"><h2 className="section-title">À faire</h2><span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">3 actions</span></div>
              <div className="space-y-2.5">{tasks.map(({ count, label, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/70 p-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-primary"><Icon className="size-[17px]" strokeWidth={1.8} /></span><div><p className="text-sm font-semibold"><span className="text-primary">{count}</span> {label}</p><p className="mt-0.5 text-[11px] text-muted-foreground">Nécessite votre attention</p></div></div>)}</div>
            </article>
          </section>

          <section className="content-card mt-3.5">
            <div className="mb-3 flex items-center justify-between"><h2 className="section-title">Commandes récentes</h2><span className="text-xs font-semibold text-primary">Aujourd'hui</span></div>
            <div className="divide-y divide-border/70">{orders.map(({ id, customer, amount, status, tone }) => <div key={id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3.5 sm:grid-cols-[90px_1fr_140px_110px]"><p className="text-sm font-semibold text-primary">{id}</p><p className="text-sm font-medium sm:order-none">{customer}</p><p className="order-4 text-sm font-semibold tabular-nums sm:order-none sm:text-right">{amount}</p><span className={`status-badge status-${tone}`}>{tone === "success" && <CheckCircle2 className="size-3" />}{status}</span></div>)}</div>
          </section>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}