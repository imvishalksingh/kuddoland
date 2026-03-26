import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUIStore from '../store/useUIStore';
import { useCartStore } from '../store/cartStore';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../api';

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(value || 0);
}

export default function CartDrawer() {
  const navigate = useNavigate();
  const cartOpen = useUIStore((state) => state.cartOpen);
  const setCartOpen = useUIStore((state) => state.setCartOpen);
  
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clear);
  
  const [checkoutForm, setCheckoutForm] = useState({
    customerName:"", email:"", mobile:"", addressLine1:"", addressLine2:"",
    city:"", state:"", postalCode:"", paymentMethod:"cod",
  });
  const [orderStatus, setOrderStatus] = useState({ type:"", message:"" });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // Body Scroll Lock
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [cartOpen]);

  const subtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  async function loadRazorpayCheckout() {
    if (window.Razorpay) return true;
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleCheckoutSubmit(e) {
    e.preventDefault(); 
    setCheckoutLoading(true); 
    setOrderStatus({ type:"", message:"" });
    
    try {
      const payload = { ...checkoutForm, items: items.map(i => ({ productId: i.id, quantity: i.quantity })) };
      
      if (checkoutForm.paymentMethod === "razorpay") {
        const gw = await createRazorpayOrder(payload);
        const loaded = await loadRazorpayCheckout();
        if (!loaded || !window.Razorpay) throw new Error("Razorpay checkout could not be loaded.");
        
        await new Promise((resolve, reject) => {
          const rp = new window.Razorpay({
            key: gw.keyId, amount: gw.amountSubunits, currency: gw.currency,
            name: "Kuddoland", description: `Order ${gw.orderNumber}`, order_id: gw.gatewayOrderId,
            prefill: gw.customer,
            handler: async resp => {
              try { 
                resolve(await verifyRazorpayPayment({ 
                  localOrderId: gw.localOrderId, 
                  razorpayOrderId: resp.razorpay_order_id, 
                  razorpayPaymentId: resp.razorpay_payment_id, 
                  razorpaySignature: resp.razorpay_signature 
                })); 
              }
              catch (err) { reject(err); }
            },
            modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
            theme: { color: "#FF8383" },
          });
          rp.open();
        }).then(res => setOrderStatus({ type:"success", message: `Payment successful. Order: ${res.orderNumber}` }));
      } else {
        const res = await createOrder(payload);
        setOrderStatus({ type:"success", message: `Order placed! Your order number is ${res.orderNumber}.` });
      }
      
      clearCart();
      setCheckoutForm({ customerName:"", email:"", mobile:"", addressLine1:"", addressLine2:"", city:"", state:"", postalCode:"", paymentMethod:"cod" });
      setTimeout(() => setCartOpen(false), 3000);
    } catch (err) { 
      setOrderStatus({ type:"error", message: err.message }); 
    } finally { 
      setCheckoutLoading(false); 
    }
  }

  return (
    <>
      <aside className={`cart-drawer ${cartOpen ? "is-open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})</h2>
          <button className="text-button" type="button" onClick={() => setCartOpen(false)}>✕ Close</button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="cart-items">
            {items.length === 0
              ? <p className="empty-cart">Your cart is empty.</p>
              : items.map((item) => (
                <article key={item.id} className="cart-item">
                  <div className="ci-image">
                    <img src={item.images?.[0] || item.image} alt={item.name} />
                  </div>
                  
                  <div className="ci-content">
                    <div className="ci-top">
                      <div>
                        <strong>{item.name}</strong>
                        <div className="ci-meta">Premium Quality</div>
                      </div>
                      <button className="remove-btn" aria-label="Remove item" onClick={() => removeItem(item.id)}>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                      </button>
                    </div>
                    
                    <div className="ci-bottom">
                      <div className="qty-spinner">
                        <span className="qty-val">{item.quantity}</span>
                        <div className="qty-btns">
                          <button className="qty-step" onClick={() => updateQuantity(item.id, item.quantity + 1)}>▲</button>
                          <button className="qty-step" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>▼</button>
                        </div>
                      </div>
                      <div className="ci-price">{formatCurrency(item.price)}</div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
          
          <div className="cart-totals">
            <p><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></p>
            <p><span>Shipping</span><strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong></p>
            <p className="total-row"><span>Total</span><strong>{formatCurrency(total)}</strong></p>
            
            <button 
              className="btn-outline btn-full" 
              style={{marginTop: '10px'}}
              onClick={() => { setCartOpen(false); navigate('/cart'); }}
            >
              View Full Cart
            </button>
          </div>
          
          <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
            <input required placeholder="Full name" value={checkoutForm.customerName} onChange={e => setCheckoutForm(c => ({ ...c, customerName: e.target.value }))} />
            <input required placeholder="Email" type="email" value={checkoutForm.email} onChange={e => setCheckoutForm(c => ({ ...c, email: e.target.value }))} />
            <input required placeholder="Mobile" value={checkoutForm.mobile} onChange={e => setCheckoutForm(c => ({ ...c, mobile: e.target.value }))} />
            <input required placeholder="Address line 1" value={checkoutForm.addressLine1} onChange={e => setCheckoutForm(c => ({ ...c, addressLine1: e.target.value }))} />
            <div className="grid-two">
              <input required placeholder="City" value={checkoutForm.city} onChange={e => setCheckoutForm(c => ({ ...c, city: e.target.value }))} />
              <input required placeholder="State" value={checkoutForm.state} onChange={e => setCheckoutForm(c => ({ ...c, state: e.target.value }))} />
            </div>
            <div className="grid-two">
              <input required placeholder="Postal code" value={checkoutForm.postalCode} onChange={e => setCheckoutForm(c => ({ ...c, postalCode: e.target.value }))} />
              <select value={checkoutForm.paymentMethod} onChange={e => setCheckoutForm(c => ({ ...c, paymentMethod: e.target.value }))}>
                <option value="cod">Cash on delivery</option>
                <option value="razorpay">Razorpay online</option>
              </select>
            </div>
            <button className="btn-coral btn-full" type="submit" disabled={checkoutLoading || items.length === 0}>
              {checkoutLoading ? "Placing order…" : "Place Order"}
            </button>
            {orderStatus.message && <p className={`status ${orderStatus.type}`}>{orderStatus.message}</p>}
          </form>
        </div>
      </aside>
      {cartOpen && <button className="cart-backdrop" type="button" aria-label="Close cart" onClick={() => setCartOpen(false)} />}
    </>
  );
}
