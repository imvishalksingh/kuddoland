import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/shipments", label: "Shipments" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/analytics", label: "Analytics" },
];

export function AdminLayout() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="bg-brand-ink px-6 py-8 text-white">
        <p className="font-display text-3xl font-extrabold">Control tower</p>
        <p className="mt-2 text-sm text-slate-300">Admin surface for catalog, orders, customers, shipping, and insights.</p>
        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/admin"} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="bg-orange-50/70 px-4 py-8 sm:px-6 lg:px-10">
        <Outlet />
      </section>
    </main>
  );
}
