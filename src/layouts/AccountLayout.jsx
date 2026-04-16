import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { ensureCsrfToken, logoutAllSessionsRequest } from "../api/auth.api";
import { User, ShoppingBag, MapPin, Heart, LogOut } from "lucide-react";

const links = [
  { to: "/account", label: "My Profile", icon: User },
  { to: "/account/orders", label: "Orders History", icon: ShoppingBag },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
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
    <div className="bg-slate-50 min-h-[60vh]">
      <main className="page-shell grid gap-8 py-12 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl shadow-sm border border-slate-200 bg-white p-6 lg:p-8 flex flex-col items-center">
            
            <div className="mb-6 flex flex-col items-center text-center">
              <img src={user?.avatar || "/cat1.png"} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm bg-slate-100" />
              <h2 className="font-sans font-bold text-[#001738] text-xl mt-4">{user?.name || "Kuddosland User"}</h2>
              <p className="text-[#4d5e75] text-[15px] mt-1">{user?.email}</p>
            </div>

            <nav className="space-y-2 w-full text-left">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/account"}
                  className={({ isActive }) => `
                    flex items-center gap-4 rounded-xl px-5 py-3.5 text-[15px] font-semibold transition-all
                    ${isActive
                      ? "bg-black text-white shadow-md"
                      : "text-[#4d5e75] hover:bg-slate-50"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <link.icon size={20} className={`${isActive ? "text-white" : "text-[#4d5e75]"}`} />
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 pt-4 w-full text-left">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-[#f03e3e] transition-all hover:bg-red-50 w-full"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <section className="min-h-96">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

