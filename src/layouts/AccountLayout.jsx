import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/account", label: "Profile" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/account/wishlist", label: "Wishlist" },
];

export function AccountLayout() {
  return (
    <main className="page-shell grid gap-6 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="panel h-fit p-5">
        <p className="mb-4 font-display text-2xl font-bold text-brand-ink">My account</p>
        <nav className="space-y-3">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/account"} className="block rounded-2xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-orange-50">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="space-y-6">
        <Outlet />
      </section>
    </main>
  );
}
