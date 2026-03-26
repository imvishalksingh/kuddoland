import { Link } from "react-router-dom";
import { Seo } from "../components/ui/Seo";
import { useCartStore } from "../store/cartStore";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal)();
  const shippingFee = subtotal > 500 ? 0 : items.length ? 50 : 0;

  return (
    <main className="page-shell grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
      <Seo title="Cart | Kuddosland" description="Cart page with coupon and order summary." />
      
      <section className="space-y-6">
        <h1 className="font-display text-5xl font-extrabold text-brand-ink">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="rounded-[28px] border-2 border-dashed border-brand-peach bg-orange-50/50 p-12 text-center">
            <p className="text-xl font-body text-slate-500 mb-6">Your cart is feeling a little empty.</p>
            <Link className="inline-block rounded-full bg-brand-peach text-brand-coral px-8 py-4 font-bold transition-all hover:bg-brand-coral hover:text-white" to="/shop">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="group flex flex-col gap-6 rounded-[28px] border border-brand-peach bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[20px] bg-orange-50">
                  <img className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" src={item.images?.[0] || item.image} alt={item.name} />
                </div>
                
                <div className="flex-1">
                  <Link to={`/shop/${item.slug || item.id}`} className="font-display text-2xl font-bold text-brand-ink hover:text-brand-coral transition-colors">{item.name}</Link>
                  <p className="text-brand-coral font-bold text-lg mt-1">{formatCurrency(item.price)}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-2xl border-2 border-slate-100 bg-slate-50">
                    <button className="px-4 py-3 text-xl text-slate-500 hover:text-brand-coral" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                    <span className="w-8 text-center font-bold text-brand-ink">{item.quantity}</span>
                    <button className="px-4 py-3 text-xl text-slate-500 hover:text-brand-coral" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="rounded-2xl bg-red-50 p-3 text-red-500 transition-colors hover:bg-red-500 hover:text-white" aria-label="Remove item" onClick={() => removeItem(item.id)}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {items.length > 0 && (
        <aside className="sticky top-28 h-fit space-y-6">
          <div className="rounded-[32px] border border-brand-peach bg-orange-50/50 p-8 shadow-sm">
            <h2 className="font-display text-3xl font-bold text-brand-ink mb-6">Summary</h2>
            
            <div className="space-y-4 font-body text-lg text-slate-600 border-b border-brand-peach pb-6">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-brand-ink">{formatCurrency(subtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-brand-ink">{shippingFee ? formatCurrency(shippingFee) : <span className="text-green-500">Free</span>}</span>
              </p>
              {shippingFee > 0 && <p className="text-sm text-brand-coral text-right mt-1">Add {formatCurrency(500 - subtotal)} more for free shipping!</p>}
            </div>
            
            <div className="py-6 flex justify-between font-display text-2xl font-bold text-brand-ink">
              <span>Total</span>
              <span className="text-brand-coral">{formatCurrency(subtotal + shippingFee)}</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input className="flex-1 rounded-2xl border-2 border-white px-4 py-3 font-body focus:border-brand-coral focus:outline-none" placeholder="Promo code" />
                <button className="rounded-2xl bg-brand-ink px-6 font-bold text-white transition-colors hover:bg-slate-800">Apply</button>
              </div>
              
              <Link className="block w-full rounded-2xl bg-brand-coral px-6 py-4 text-center text-xl font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl" to="/checkout">
                Proceed to Checkout
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-slate-400 opacity-60">
            <span>🔒 Secure Checkout</span>
          </div>
        </aside>
      )}
    </main>
  );
}
