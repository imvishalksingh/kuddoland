import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Seo } from "../components/ui/Seo";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal)();
  const shippingFee = subtotal > 500 ? 0 : items.length ? 50 : 0;
  
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    pincode: "",
    city: "",
    state: "",
    line1: "",
    line2: "",
  });

  return (
    <main className="page-shell grid gap-10 py-12 lg:grid-cols-[1fr_400px]">
      <Seo title="Checkout | Kuddosland" description="Multi-step address, payment, and confirm checkout flow." />
      
      <section className="space-y-8">
        <div>
          <h1 className="font-display text-5xl font-extrabold text-brand-ink mb-6">Checkout</h1>
          <div className="flex gap-2 text-sm font-bold font-body">
            <span className="text-brand-coral">Cart</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-brand-ink">Information</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-400">Shipping</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-400">Payment</span>
          </div>
        </div>

        <div className="rounded-[32px] border border-brand-peach bg-white p-8 shadow-sm space-y-6">
          <h2 className="font-display text-2xl font-bold text-brand-ink">Contact Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors" placeholder="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors" placeholder="Email address" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <input className="rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors md:col-span-2" placeholder="Phone mobile" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </div>

          <h2 className="font-display text-2xl font-bold text-brand-ink pt-4 border-t border-slate-100">Shipping Address</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <textarea className="min-h-[120px] rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors md:col-span-2 resize-none" placeholder="Address (House No, Building, Street, Area)&#10;Apartment, suite, etc. (optional)" value={`${form.line1}\n${form.line2}`.trim()} onChange={(event) => {
              const lines = event.target.value.split("\n");
              setForm((current) => ({ ...current, line1: lines[0] || "", line2: lines.slice(1).join(" ") || "" }));
            }} />
            <input className="rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors" placeholder="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            <input className="rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors" placeholder="State" value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} />
            <input className="rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors md:col-span-2" placeholder="PIN Code" value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))} />
          </div>
        </div>

        <div className="flex justify-between items-center px-2">
          <Link to="/cart" className="text-brand-coral font-bold hover:underline flex items-center gap-1">
            <span>&lt;</span> Return to cart
          </Link>
          <button
            className="rounded-2xl bg-brand-coral px-10 py-5 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            onClick={async () => {
              if (!user) {
                toast.error("Please log in before checkout");
                navigate("/login");
                return;
              }
              if (!items.length) {
                toast.error("Your cart is empty");
                return;
              }
              if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) {
                toast.error("Please fill all required shipping fields");
                return;
              }
              // Simulate navigation to a Payment choice page
              navigate("/payment", { state: { form } });
            }}
          >
            Continue to Payment
          </button>
        </div>
      </section>

      <aside className="sticky top-28 h-fit">
        <div className="rounded-[32px] border border-brand-peach bg-orange-50/50 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-peach rounded-bl-full -z-10 opacity-50"></div>
          
          <h2 className="font-display text-3xl font-bold text-brand-ink mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 border-b border-brand-peach pb-6 max-h-[300px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-xl bg-white border border-slate-100 flex-shrink-0">
                  <img src={item.images?.[0] || item.image || "/cat1.png"} alt={item.name} className="h-full w-full object-contain p-1 mix-blend-multiply" />
                  <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-ink truncate">{item.name}</p>
                  <p className="text-sm text-slate-500 truncate">{item.category}</p>
                </div>
                <div className="font-bold text-brand-ink">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4 font-body text-lg text-slate-600 border-b border-brand-peach pb-6">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-brand-ink">₹{subtotal}</span>
            </p>
            <p className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-brand-ink">{shippingFee ? `₹${shippingFee}` : <span className="text-green-500">Free</span>}</span>
            </p>
          </div>
          
          <div className="mt-6 flex justify-between font-display text-3xl font-bold text-brand-ink">
            <span>Total</span>
            <span className="text-brand-coral">₹{subtotal + shippingFee}</span>
          </div>
          
          <p className="mt-6 text-sm text-center text-slate-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Secure, encrypted checkout
          </p>
        </div>
      </aside>
    </main>
  );
}
