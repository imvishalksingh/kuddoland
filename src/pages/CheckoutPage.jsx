import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Seo } from "../components/ui/Seo";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { createOrder } from "../api/orders.api";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) => state.subtotal)();
  const shippingFee = subtotal > 500 ? 0 : items.length ? 50 : 0;
  const estimatedTaxes = subtotal * 0.18;
  const total = subtotal + shippingFee + estimatedTaxes;
  
  const [showSummary, setShowSummary] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Ensures entering the route from any path snaps to the top identically
    window.scrollTo(0, 0);
  }, []);
  
  const [form, setForm] = useState({
    emailOrPhone: user?.email || user?.phone || "",
    newsAndOffers: false,
    country: "India",
    firstName: user?.name ? user.name.split(' ')[0] : "",
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : "",
    address: "",
    apartment: "",
    city: "",
    state: "Delhi",
    pincode: "",
    saveInfo: false,
    billingSame: true
  });

  const OrderSummary = ({ mobile }) => (
    <div className={`space-y-4 ${mobile ? '' : 'sticky top-10'}`}>
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <div className="relative h-[64px] w-[64px] rounded-lg bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center p-1">
              <img src={item.images?.[0] || item.image || "/cat1.png"} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
              <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="font-semibold text-sm text-[#333333] truncate">{item.name}</p>
              <p className="text-[12px] text-gray-500 truncate mt-0.5">{item.category}</p>
            </div>
            <div className="font-semibold text-sm text-[#333333] pt-1">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex gap-3">
        <div className="flex-1">
          <input type="text" placeholder="Discount code" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-gray-500" />
        </div>
        <button className="bg-[#f0f0f0] text-gray-400 font-semibold px-4 py-3 rounded-md text-sm cursor-not-allowed">
          Apply
        </button>
      </div>
      
      <div className="pt-4 space-y-2 text-sm text-[#333333]">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          {form.address ? (
            <span className="font-semibold">{shippingFee ? formatCurrency(shippingFee) : "Free"}</span>
          ) : (
            <span className="text-gray-500 text-xs">Enter shipping address</span>
          )}
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="flex items-center gap-1">Estimated taxes <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
          <span className="font-semibold">{formatCurrency(estimatedTaxes)}</span>
        </div>
      </div>
      
      <div className="pt-4 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-[#333333]">Total</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500 font-semibold mb-1">INR</span>
          <span className="text-2xl font-bold text-[#333333]">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white lg:flex lg:flex-row-reverse font-sans text-[#333333]">
      <Seo title="Checkout - Kuddosland" description="Secure Shopify-style checkout." />
      
      {/* Mobile Header / Summary Toggle */}
      <div className="lg:hidden bg-[#f5f5f5] border-b border-gray-200">
        <div className="px-5 py-4">
           <button 
             onClick={() => setShowSummary(!showSummary)}
             className="w-full flex justify-between items-center text-[14px] font-semibold text-blue-600 outline-none"
           >
             <span className="flex items-center gap-2">
               🛒 <span className="text-[14px]">{showSummary ? 'Hide order summary' : 'Show order summary'}</span>
               <svg className={`w-3.5 h-3.5 transition-transform ${showSummary ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
             </span>
             <span className="text-[#333333] text-lg font-semibold">{formatCurrency(total)}</span>
           </button>
        </div>
        {showSummary && (
          <div className="px-5 pb-5 border-t border-gray-200 pt-5">
            <OrderSummary mobile />
          </div>
        )}
      </div>

      {/* Desktop Right Side (Summary) */}
      <div className="hidden lg:block lg:w-[45%] xl:w-[45%] bg-[#f5f5f5] border-l border-gray-200 min-h-screen">
         <div className="pt-14 pb-10 px-10 xl:px-14 max-w-lg">
           <OrderSummary />
         </div>
      </div>

      {/* Left Side (Form) */}
      <div className="lg:w-[55%] xl:w-[55%] px-5 sm:px-10 lg:pl-10 lg:pr-14 xl:pl-32 xl:pr-20 pt-8 lg:pt-14 pb-20">
        <div className="max-w-xl mx-auto lg:ml-auto lg:mr-0 space-y-8">
          
          <div className="hidden lg:block">
            <h1 className="text-3xl font-medium text-[#333333] mb-4">Kuddosland</h1>
            <div className="flex gap-2 text-[12px] text-gray-500 mb-8">
              <Link to="/cart" className="hover:text-[#333333] transition-colors">Cart</Link>
              <span>/</span>
              <span className="font-semibold text-[#333333]">Information</span>
              <span>/</span>
              <span>Payment</span>
            </div>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Contact Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[19px] font-semibold text-[#333333]">Contact</h2>
                <div onClick={openAuthModal} className="text-sm text-blue-600 hover:underline cursor-pointer">Sign in</div>
              </div>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Email or mobile phone number" 
                  className="w-full rounded-md border border-gray-300 px-3.5 py-3 text-sm focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none" 
                  value={form.emailOrPhone} 
                  onChange={(e) => setForm(c => ({...c, emailOrPhone: e.target.value}))} 
                />
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input type="checkbox" checked={form.newsAndOffers} onChange={(e) => setForm(c => ({...c, newsAndOffers: e.target.checked}))} className="w-[18px] h-[18px] rounded border-gray-300 text-[#333333] focus:ring-[#333333] accent-[#333333]" />
                  <span className="text-[14px] text-[#333333]">Email me with news and offers</span>
                </label>
              </div>
            </div>

            {/* Delivery Section */}
            <div>
              <h2 className="text-[19px] font-semibold text-[#333333] mb-3">Delivery</h2>
              <div className="space-y-3">
                <div className="relative">
                  <label className="absolute top-1.5 left-3.5 text-[11px] text-gray-500">Country/Region</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 pl-3.5 pr-8 pt-6 pb-2 text-[14px] appearance-none bg-white focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none"
                    value={form.country}
                    onChange={(e) => setForm(c => ({...c, country: e.target.value}))}
                  >
                    <option value="India">India</option>
                  </select>
                  <div className="absolute right-3.5 top-[18px] pointer-events-none text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="First name (optional)" className="rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none" value={form.firstName} onChange={(e) => setForm(c => ({...c, firstName: e.target.value}))} />
                  <input type="text" placeholder="Last name" className="rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none bg-white" value={form.lastName} onChange={(e) => setForm(c => ({...c, lastName: e.target.value}))} />
                </div>

                <div className="relative">
                  <input type="text" placeholder="Address" className="w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] pr-10 focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none" value={form.address} onChange={(e) => setForm(c => ({...c, address: e.target.value}))} />
                  <div className="absolute right-3.5 top-4 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 16.5L20 20" /></svg>
                  </div>
                </div>
                
                <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none" value={form.apartment} onChange={(e) => setForm(c => ({...c, apartment: e.target.value}))} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" placeholder="City" className="rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none" value={form.city} onChange={(e) => setForm(c => ({...c, city: e.target.value}))} />
                  <div className="relative sm:col-span-1">
                    <label className="absolute top-1.5 left-3.5 text-[10px] text-gray-500">State</label>
                    <select className="w-full rounded-md border border-gray-300 pl-3.5 pr-8 pt-5 pb-1 text-[14px] appearance-none bg-white focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none" value={form.state} onChange={(e) => setForm(c => ({...c, state: e.target.value}))}>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                    <div className="absolute right-3.5 top-4 pointer-events-none text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <input type="text" placeholder="PIN code" className="rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none" value={form.pincode} onChange={(e) => setForm(c => ({...c, pincode: e.target.value}))} />
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input type="checkbox" checked={form.saveInfo} onChange={(e) => setForm(c => ({...c, saveInfo: e.target.checked}))} className="w-[18px] h-[18px] rounded border-gray-300 focus:ring-[#333333] accent-[#333333]" />
                  <span className="text-[14px] text-[#333333]">Save this information for next time</span>
                </label>
              </div>
            </div>

            {/* Shipping Method Section */}
            <div>
              <h2 className="text-[19px] font-semibold text-[#333333] mb-3">Shipping method</h2>
              <div className="bg-[#f5f5f5] rounded-md p-4 text-center">
                <p className="text-[14px] text-gray-500">
                  Enter your shipping address to view available shipping methods.
                </p>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h2 className="text-[19px] font-semibold text-[#333333]">Payment</h2>
              <p className="text-[13px] text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              
              <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
                <label className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-300 transition-colors ${selectedMethod === 'card' ? 'bg-[#f5f5f5] bg-opacity-40' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="w-[18px] h-[18px] accent-[#333333] text-[#333333] focus:ring-[#333333]" />
                  <span className="text-[14px] text-[#333333] flex-1">Credit card</span>
                  <div className="bg-[#e49b22] text-white font-bold text-[11px] w-8 h-[22px] rounded flex items-center justify-center">B</div>
                </label>
                
                {selectedMethod === 'card' && (
                  <div className="p-4 bg-[#f5f5f5] bg-opacity-40 border-b border-gray-300">
                    <div className="grid gap-3.5 mb-4">
                      <div className="relative">
                        <input type="text" placeholder="Card number" className="w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none bg-white shadow-sm" />
                        <svg className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <div className="grid grid-cols-2 gap-3.5">
                        <input type="text" placeholder="Expiration date (MM / YY)" className="rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none bg-white shadow-sm" />
                        <div className="relative">
                          <input type="text" placeholder="Security code" className="w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none bg-white shadow-sm" />
                          <div className="absolute right-3.5 top-[13px] w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-500">?</div>
                        </div>
                      </div>
                      <input type="text" placeholder="Name on card" className="w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none bg-white shadow-sm" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-3">
                      <input type="checkbox" checked={form.billingSame} onChange={(e) => setForm(c => ({...c, billingSame: e.target.checked}))} className="w-[18px] h-[18px] rounded border-gray-300 bg-black text-black accent-black" />
                      <span className="text-[14px] text-[#333333]">Use shipping address as billing address</span>
                    </label>
                  </div>
                )}
                
                <label className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedMethod === 'upi' ? 'bg-[#f5f5f5] bg-opacity-40' : 'bg-white hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="w-[18px] h-[18px] accent-[#333333]" />
                  <span className="text-[14px] text-[#333333] flex-1">UPI (Google Pay, Paytm)</span>
                </label>
                {selectedMethod === 'upi' && (
                  <div className="p-4 bg-[#f5f5f5] bg-opacity-40 border-t border-gray-300">
                    <input type="text" placeholder="Enter UPI ID" className="w-full rounded-md border border-gray-300 px-3.5 py-3.5 text-[14px] focus:border-[#333333] focus:ring-1 focus:ring-[#333333] outline-none bg-white shadow-sm" />
                  </div>
                )}
                
                <div className="border-t border-gray-300"></div>

                <label className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedMethod === 'cod' ? 'bg-[#f5f5f5] bg-opacity-40' : 'bg-white hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="w-[18px] h-[18px] accent-[#333333]" />
                  <span className="text-[14px] text-[#333333] flex-1">Cash on Delivery (COD)</span>
                </label>
                {selectedMethod === 'cod' && (
                  <div className="p-4 bg-[#f5f5f5] bg-opacity-40 border-t border-gray-300 text-center">
                    <p className="text-[13px] text-gray-500">Pay in cash when order is delivered.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile elements (Add discount, Final Button) */}
            <div className="lg:hidden pt-4 pb-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-[13px] font-semibold text-[#333333] mb-6 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                Add discount
              </button>
              
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-lg text-[#333333]">Total</span>
                  <span className="text-[13px] text-gray-500 mt-0.5">{items.length} item{items.length !== 1 && 's'}</span>
                </div>
                <div className="flex gap-2 items-baseline">
                  <span className="text-[11px] text-gray-500 font-semibold mb-1">INR</span>
                  <span className="text-xl font-bold text-[#333333] flex items-center gap-1">
                    {formatCurrency(total)}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                className={`w-full bg-[#f87171] hover:bg-[#ef4444] text-white px-8 py-5 rounded-md font-semibold text-[15px] shadow-sm active:scale-[0.98] transition-all ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                disabled={isProcessing}
                onClick={async (e) => {
                  e.preventDefault();
                  
                  if (!items.length) {
                    toast.error("Your cart is empty");
                    return;
                  }
                  if (!form.lastName || !form.emailOrPhone || !form.address || !form.city || !form.pincode) {
                    toast.error("Please fill all required shipping fields");
                    return;
                  }
                  
                  setIsProcessing(true);
                  
                  try {
                    const isEmail = form.emailOrPhone.includes('@');
                    
                    const response = await createOrder({
                      paymentMethod: selectedMethod === "cod" ? "cod" : "online",
                      couponCode: "",
                      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
                      address: {
                        name: `${form.firstName} ${form.lastName}`.trim(),
                        phone: isEmail ? "0000000000" : form.emailOrPhone,
                        line1: form.address,
                        line2: form.apartment,
                        city: form.city,
                        state: form.state,
                        pincode: form.pincode,
                        country: form.country,
                        isDefault: true,
                      },
                    });
                    
                    clear();
                    toast.success("Payment successful!");
                    navigate(`/order-confirmation/${response.order?.id || 'TEST-ORDER-123'}`);
                  } catch (error) {
                    toast.error(error.response?.data?.message || "Payment failed");
                    setIsProcessing(false);
                  }
                }}
              >
                {isProcessing ? 'Processing...' : 'Pay now'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
