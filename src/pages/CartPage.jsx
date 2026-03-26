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
    <main className="page-shell min-h-[70vh] py-12 lg:py-20">
      <Seo title="Your Shopping Cart | Kuddosland" description="View and manage items in your cart." />
      
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Main Cart Content */}
        <section className="flex-1">
          <div className="mb-10">
            <h1 className="font-display text-5xl font-extrabold text-brand-ink leading-tight sm:text-6xl">Your Cart</h1>
            <p className="mt-4 font-body text-lg text-slate-500">
              {items.length === 0 ? "Your shopping bag is waiting for toys!" : `You have ${items.reduce((s,i) => s+i.quantity,0)} items in your cart.`}
            </p>
          </div>
          
          {items.length === 0 ? (
            <div className="rounded-[40px] border-2 border-dashed border-brand-peach bg-orange-50/30 p-16 text-center transition-all hover:bg-orange-50/50">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-sm">🛒</div>
              <p className="text-2xl font-body font-bold text-slate-600 mb-8">It looks like your cart is empty!</p>
              <Link className="inline-flex items-center gap-3 rounded-full bg-brand-coral px-10 py-5 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95" to="/shop">
                Start Shopping 🧸
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="group relative flex flex-col gap-6 rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 sm:flex-row sm:items-center lg:p-8">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[24px] bg-slate-50 sm:h-40 sm:w-40">
                    <img className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" src={item.images?.[0] || item.image} alt={item.name} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/shop/${item.slug || item.id}`} className="font-display text-2xl font-bold text-brand-ink hover:text-brand-coral transition-colors sm:text-3xl leading-snug">{item.name}</Link>
                        <p className="mt-2 text-brand-coral font-extrabold text-xl sm:text-2xl">{formatCurrency(item.price)}</p>
                      </div>
                      <button className="rounded-2xl bg-red-50 p-3 text-red-500 transition-all hover:bg-red-500 hover:text-white group-hover:opacity-100 sm:opacity-0" aria-label="Remove item" onClick={() => removeItem(item.id)}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                      </button>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap items-center gap-6">
                      <div className="flex items-center rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-1">
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-500 transition-colors hover:bg-white hover:text-brand-coral" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button>
                        <span className="w-10 text-center font-bold text-brand-ink text-lg">{item.quantity}</span>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-500 transition-colors hover:bg-white hover:text-brand-coral" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="text-sm font-bold text-slate-400">Total: {formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar Summary */}
        {items.length > 0 && (
          <aside className="lg:w-[400px]">
            <div className="sticky top-28 space-y-8 rounded-[40px] border border-orange-100 bg-white p-8 shadow-2xl shadow-brand-peach/20 lg:p-10">
              <h2 className="font-display text-4xl font-extrabold text-brand-ink">Summary</h2>
              
              <div className="space-y-5 font-body text-xl text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-ink">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-brand-ink">{shippingFee ? formatCurrency(shippingFee) : <span className="text-green-500 font-extrabold">FREE ✨</span>}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="rounded-2xl bg-orange-50 p-4 text-center text-sm font-bold text-brand-coral">
                    Add {formatCurrency(500 - subtotal)} more for free shipping!
                  </div>
                )}
              </div>
              
              <div className="border-t border-brand-peach pt-6 flex justify-between font-display text-3xl font-extrabold text-brand-ink">
                <span>Total</span>
                <span className="text-brand-coral">{formatCurrency(subtotal + shippingFee)}</span>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-2">
                  <input className="min-w-0 flex-1 rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 font-bold placeholder:text-slate-400 focus:border-brand-coral focus:bg-white transition-all outline-none" placeholder="Promo code" />
                  <button className="rounded-2xl bg-brand-ink px-6 font-bold text-white transition-all hover:bg-slate-800 active:scale-95">Apply</button>
                </div>
                
                <Link className="flex w-full items-center justify-center gap-3 rounded-3xl bg-brand-coral py-5 text-center text-xl font-bold text-white shadow-xl shadow-brand-coral/25 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95" to="/checkout">
                  Checkout →
                </Link>
                
                <Link to="/shop" className="block text-center text-sm font-bold text-slate-400 hover:text-brand-ink transition-colors">
                  &larr; Continue Shopping
                </Link>
              </div>
            </div>
        </aside>
      )}
    </div>
  </main>
);
}
