import { Link, useParams } from "react-router-dom";
import { Seo } from "../components/ui/Seo";

export function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <main className="page-shell py-20 px-4">
      <Seo title="Order Confirmed | Kuddosland" description="Order confirmation summary page." />
      <div className="mx-auto max-w-2xl text-center space-y-8">
        
        {/* Success Animation & Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-mint text-brand-ink mb-2">
          <div className="absolute inset-0 rounded-full bg-brand-mint animate-ping opacity-20"></div>
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>

        <div>
          <h1 className="font-display text-5xl font-extrabold text-brand-ink">Order Confirmed!</h1>
          <p className="mt-4 text-xl text-slate-500 font-body">Thank you for shopping with Kuddoland. Your furry friends are getting ready for their journey!</p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-[32px] border border-brand-peach bg-white p-8 md:p-10 shadow-sm space-y-6 text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3 h-full bg-brand-coral"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Order Reference</p>
              <p className="font-display text-2xl font-bold text-brand-ink">#{orderId}</p>
            </div>
            <Link to={`/track/${orderId}`} className="text-brand-coral font-bold hover:underline bg-brand-peach px-4 py-2 rounded-full text-center transition-colors hover:bg-brand-coral hover:text-white">
              Track Order
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Delivery Details</p>
              <p className="font-body text-brand-ink text-lg font-medium">Standard Shipping</p>
              <p className="font-body text-slate-500">Estimated delivery: 3-5 business days.</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Updates</p>
              <p className="font-body text-slate-500">We&apos;ve sent a confirmation email with your order details and tracking link.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop" className="w-full sm:w-auto rounded-full bg-brand-coral px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-opacity-90">
            Continue Shopping
          </Link>
          <Link to="/account/orders" className="w-full sm:w-auto rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-lg font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300">
            View My Orders
          </Link>
        </div>

      </div>
    </main>
  );
}
