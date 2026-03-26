import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createOrder } from "../api/orders.api";
import { Seo } from "../components/ui/Seo";
import { useCartStore } from "../store/cartStore";

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state?.form;
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!form || !items.length) {
    navigate("/checkout");
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await createOrder({
        paymentMethod: selectedMethod === "cod" ? "cod" : "online",
        couponCode: "",
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        address: {
          name: form.name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: "India",
          isDefault: true,
        },
      });
      clear();
      toast.success("Payment successful! Order placed.");
      navigate(`/order-confirmation/${response.order?.id || 'TEST-ORDER-123'}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <main className="page-shell max-w-3xl py-12">
      <Seo title="Payment | Kuddosland" description="Complete your secure payment." />
      
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-5xl font-extrabold text-brand-ink mb-6 text-center">Secure Payment</h1>
          <div className="flex justify-center gap-2 text-sm font-bold font-body">
            <span className="text-brand-coral">Cart</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-brand-coral">Information</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-brand-coral">Shipping</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-brand-ink">Payment</span>
          </div>
        </div>

        <div className="rounded-[32px] border border-brand-peach bg-white p-8 shadow-sm space-y-8">
          
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-ink">Select Payment Method</h2>
            
            <div className="grid gap-4">
              {/* UPI Option */}
              <label className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center gap-4 transition-all ${selectedMethod === 'upi' ? 'border-brand-coral bg-brand-peach/30' : 'border-slate-100 bg-slate-50 hover:border-brand-peach'}`}>
                <input type="radio" name="payment" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-5 h-5 text-brand-coral focus:ring-brand-coral" />
                <div className="flex-1">
                  <p className="font-bold text-brand-ink text-lg">UPI (Google Pay, PhonePe, Paytm)</p>
                  <p className="text-slate-500 text-sm font-body">Instant payment using UPI apps.</p>
                </div>
                <div className="text-3xl">📱</div>
              </label>

              {/* Card Option */}
              <label className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center gap-4 transition-all ${selectedMethod === 'card' ? 'border-brand-coral bg-brand-peach/30' : 'border-slate-100 bg-slate-50 hover:border-brand-peach'}`}>
                <input type="radio" name="payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="w-5 h-5 text-brand-coral focus:ring-brand-coral" />
                <div className="flex-1">
                  <p className="font-bold text-brand-ink text-lg">Credit / Debit Card</p>
                  <p className="text-slate-500 text-sm font-body">Visa, Mastercard, RuPay & more.</p>
                </div>
                <div className="text-3xl">💳</div>
              </label>

              {/* COD Option */}
              <label className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center gap-4 transition-all ${selectedMethod === 'cod' ? 'border-brand-coral bg-brand-peach/30' : 'border-slate-100 bg-slate-50 hover:border-brand-peach'}`}>
                <input type="radio" name="payment" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="w-5 h-5 text-brand-coral focus:ring-brand-coral" />
                <div className="flex-1">
                  <p className="font-bold text-brand-ink text-lg">Cash on Delivery</p>
                  <p className="text-slate-500 text-sm font-body">Pay in cash when order is delivered.</p>
                </div>
                <div className="text-3xl">💵</div>
              </label>
            </div>
          </div>

          {selectedMethod === 'card' && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in grid gap-4">
              <input type="text" placeholder="Card Number" className="rounded-xl border-2 border-white px-4 py-3 font-body focus:border-brand-coral focus:outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" className="rounded-xl border-2 border-white px-4 py-3 font-body focus:border-brand-coral focus:outline-none" />
                <input type="text" placeholder="CVV" className="rounded-xl border-2 border-white px-4 py-3 font-body focus:border-brand-coral focus:outline-none" />
              </div>
              <input type="text" placeholder="Name on Card" className="rounded-xl border-2 border-white px-4 py-3 font-body focus:border-brand-coral focus:outline-none" />
            </div>
          )}
          
          {selectedMethod === 'upi' && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in flex flex-col items-center justify-center gap-4">
               <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="UPI QR Code" className="w-48 h-48 mix-blend-multiply opacity-50" />
               <p className="text-slate-500 font-body font-medium text-center">Scan this QR code with any UPI app to pay</p>
               <div className="w-full flex items-center gap-4 my-2">
                 <div className="h-px bg-slate-200 flex-1"></div>
                 <span className="text-slate-400 font-body text-sm">Or</span>
                 <div className="h-px bg-slate-200 flex-1"></div>
               </div>
               <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="w-full rounded-xl border-2 border-white px-4 py-3 font-body focus:border-brand-coral focus:outline-none" />
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-brand-peach">
            <Link to="/checkout" className="text-brand-coral font-bold hover:underline flex items-center gap-1">
              <span>&lt;</span> Back to shipping
            </Link>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`rounded-2xl bg-brand-coral px-10 py-5 text-lg font-bold text-white shadow-lg transition-all ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1 hover:shadow-xl'}`}
            >
              {isProcessing ? 'Processing Payment...' : `Pay & Place Order`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
