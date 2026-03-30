import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { ensureCsrfToken, logoutAllSessionsRequest } from "../api/auth.api";

const links = [
  { to: "/account", label: "Profile", icon: "👤" },
  { to: "/account/orders", label: "Orders", icon: "📦" },
  { to: "/account/addresses", label: "Addresses", icon: "📍" },
  { to: "/account/wishlist", label: "Wishlist", icon: "✨" },
];

export function AccountLayout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await ensureCsrfToken();
      await logoutAllSessionsRequest();
      logout();
      toast.success("Logged out from your account");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#fffaf5] min-h-[60vh]">
      <main className="page-shell grid gap-8 py-12 lg:grid-cols-[280px_1fr]">
        {/* Mobile Header / Welcome */}
        <div className="lg:hidden mb-2 px-1">
          <h1 className="font-display text-4xl font-extrabold text-brand-ink">Hello, {user?.name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-slate-500 font-body text-sm mt-1">Manage your orders and personal details.</p>
        </div>

        <aside className="space-y-6">
          <div className="panel border-none shadow-premium p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-coral"></div>
            <div className="hidden lg:block mb-8">
              <p className="font-display text-3xl font-extrabold text-brand-ink leading-tight">My account</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Personal Management</p>
            </div>

            <nav className="space-y-1.5">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/account"}
                  className={({ isActive }) => `
                    flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all
                    ${isActive
                      ? "bg-brand-coral text-white shadow-lg shadow-brand-coral/20 -translate-x-1"
                      : "text-slate-600 hover:bg-orange-50 hover:text-brand-coral"}
                  `}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold text-red-400 transition-all hover:bg-red-50 hover:text-red-500"
              >
                <span className="text-lg">🚪</span>
                Logout
              </button>
            </div>
          </div>

          <div className="panel bg-[#ff8b87] text-white p-6 border-none shadow-lg">
            <p className="font-display text-lg font-bold">Need help?</p>
            <p className="text-white/80 text-xs font-body mt-2 leading-relaxed">Our support team is active 24/7 for your toy queries & order assistance.</p>
            <button className="mt-4 text-[11px] font-bold uppercase tracking-widest bg-white text-[#ff8b87] px-4 py-2 rounded-full hover:bg-white/90 transition">Contact us</button>
          </div>
        </aside>

        <section className="min-h-[400px]">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

