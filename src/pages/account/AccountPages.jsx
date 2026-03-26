import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ensureCsrfToken, logoutAllSessionsRequest, resendVerification } from "../../api/auth.api";
import { getAddresses, getProfile, getWishlist, updateProfile } from "../../api/users.api";
import { getMyOrders, getOrder, requestReturn } from "../../api/orders.api";
import { DashboardPlaceholder } from "../../components/shop/DashboardPlaceholder";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { ProductCard } from "../../components/shop/ProductCard";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-[32px] border border-brand-peach bg-white p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const Input = (props) => (
  <input 
    {...props} 
    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3 font-body text-slate-700 transition-colors focus:border-brand-coral focus:bg-white focus:outline-none placeholder:text-slate-400" 
  />
);

export function AccountPage() {
  const { data } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [form, setForm] = useState({ name: data?.user?.name || "", phone: data?.user?.phone || "" });

  useEffect(() => {
    if (data?.user) {
      setForm({ name: data.user.name || "", phone: data.user.phone || "" });
    }
  }, [data]);

  return (
    <section className="space-y-6">
      <h1 className="font-display text-4xl font-extrabold text-brand-ink mb-2">My Profile</h1>
      
      {!data?.user?.isVerified && (
        <Card className="border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-brand-ink text-lg">Verify your email address</p>
              <p className="text-slate-600 font-body mt-1">Please verify your email to unlock checkout and reviews.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="rounded-full bg-brand-coral px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-opacity-90"
                  onClick={async () => {
                    try {
                      await ensureCsrfToken();
                      const response = await resendVerification();
                      toast.success(response.verificationTokenPreview ? `Dev verify token: ${response.verificationTokenPreview}` : "Verification email resent");
                    } catch (error) {
                      toast.error(error.response?.data?.message || "Resend failed");
                    }
                  }}
                >
                  Resend Email
                </button>
                <Link className="rounded-full border-2 border-brand-peach px-5 py-2 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-peach" to="/verify-email">
                  Enter Token
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-brand-ink">Personal Information</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 pl-1">Full Name</label>
            <Input value={form.name} placeholder={data?.user?.name || "Full name"} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 pl-1">Phone Number</label>
            <Input value={form.phone} placeholder={data?.user?.phone || "Phone"} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2 pl-1">Email Address</label>
            <div className="w-full rounded-2xl border-2 border-slate-100 bg-slate-100 px-5 py-3 font-body text-slate-500 cursor-not-allowed">
              {data?.user?.email || "Email"}
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <button className="rounded-full bg-brand-coral px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => updateProfile(form)}>
            Save Changes
          </button>
          
          <button
            className="rounded-full border-2 border-red-100 bg-red-50 px-6 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-100"
            onClick={async () => {
              try {
                await ensureCsrfToken();
                await logoutAllSessionsRequest();
                logout();
                toast.success("Logged out successfully");
                navigate("/login");
              } catch (error) {
                toast.error(error.response?.data?.message || "Logout failed");
              }
            }}
          >
            Logout
          </button>
        </div>
      </Card>
    </section>
  );
}

export function AccountOrdersPage() {
  const { data } = useQuery({ queryKey: ["my-orders"], queryFn: getMyOrders });
  const items = data?.items || [];

  if (!items.length) {
    return (
      <DashboardPlaceholder
        eyebrow="Orders"
        title="No orders yet"
        description="Place an order from checkout and it will appear here."
        highlights={[
          { label: "History", title: "Your order timeline", body: "Each placed order will show status, totals, shipment, and payment summary here." },
          { label: "Tracking", title: "Real order IDs", body: "Once shipments are assigned, you can jump into tracking from this area." },
        ]}
      />
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="font-display text-4xl font-extrabold text-brand-ink mb-2">Order History</h1>
      <div className="space-y-4">
        {items.map((order) => (
          <Card key={order.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between hover:border-brand-coral transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Order #{order.id}</p>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'DELIVERED' ? 'bg-brand-mint text-brand-ink' : 'bg-orange-100 text-orange-600'}`}>
                  {order.status}
                </span>
                <span className="text-slate-500 font-body">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 justify-between md:justify-end border-t border-slate-100 md:border-0 pt-4 md:pt-0">
              <div className="text-right">
                <p className="text-sm text-slate-500 font-body">Total</p>
                <p className="font-display text-xl font-bold text-brand-ink">₹{order.total}</p>
              </div>
              <Link className="rounded-full bg-brand-peach px-6 py-2.5 text-sm font-bold text-brand-coral transition-colors hover:bg-brand-coral hover:text-white" to={`/account/orders/${order.id}`}>
                View Details
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function AccountOrderDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const { data } = useQuery({ queryKey: ["account-order", params.id], queryFn: () => getOrder(params.id) });
  const mutation = useMutation({
    mutationFn: (payload) => requestReturn(params.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-order", params.id] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Return requested");
      setReason("");
      setDetails("");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Return request failed"),
  });

  const item = data?.item;
  if (!item) {
    return (
      <section className="space-y-6">
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-100 rounded w-1/3"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-4 bg-slate-100 rounded w-1/4"></div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-4xl font-extrabold text-brand-ink">Order Details</h1>
        <Link to="/account/orders" className="text-brand-coral font-bold hover:underline hidden sm:block">Back to orders</Link>
      </div>

      <Card className="space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-brand-coral"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Order Reference</p>
            <p className="font-display text-2xl font-bold text-brand-ink">#{item.id}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-600 inline-block">{item.status}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Order Total</p>
              <p className="font-display text-xl font-bold text-brand-ink">₹{item.total}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 text-sm text-slate-600 font-body">
          <div>
            <p className="font-bold text-brand-ink mb-2">Order Summary</p>
            <div className="space-y-1">
              <p>Placed: {new Date(item.createdAt).toLocaleString()}</p>
              <p>Shipment: {item.shipment?.status || "Processing"}</p>
              <p>Payment: {item.payment?.status || "Pending"}</p>
            </div>
          </div>
          {item.returnReason && (
            <div>
              <p className="font-bold text-brand-ink mb-2">Return Information</p>
              <div className="space-y-1">
                <p>Reason: {item.returnReason}</p>
                <p>Status: {item.returnDecisionNote || "Pending Review"}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-brand-ink mb-4">Items</h2>
        <div className="divide-y divide-slate-100">
          {item.items.map((orderItem) => (
            <div key={orderItem.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-2xl">🧸</div>
                <div>
                  <p className="font-bold text-brand-ink text-lg">{orderItem.productSnapshot?.name || "Product"}</p>
                  <p className="text-sm text-slate-500 font-body">Qty: {orderItem.quantity}</p>
                </div>
              </div>
              <p className="font-bold text-brand-ink text-lg">₹{orderItem.price}</p>
            </div>
          ))}
        </div>
      </Card>

      {item.status !== "RETURN_REQUESTED" && item.status !== "REFUNDED" && item.status !== "CANCELLED" && (
        <Card className="space-y-4 bg-orange-50/50">
          <h2 className="font-display text-2xl font-bold text-brand-ink">Need to return?</h2>
          <p className="text-slate-600 font-body text-sm mb-4">If you are not satisfied with your order, you can request a return within 7 days of delivery.</p>
          <div className="space-y-3">
            <Input placeholder="Reason for return (e.g., Damaged item, Wrong size)" value={reason} onChange={(event) => setReason(event.target.value)} />
            <textarea className="min-h-24 w-full rounded-2xl border-2 border-slate-100 bg-white px-5 py-3 font-body text-slate-700 focus:border-brand-coral focus:outline-none placeholder:text-slate-400 resize-none" placeholder="Provide additional details..." value={details} onChange={(event) => setDetails(event.target.value)} />
            <div className="pt-2">
              <button 
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-1 hover:bg-black disabled:opacity-50 disabled:hover:translate-y-0"
                onClick={() => mutation.mutate({ reason, details })} 
                disabled={!reason.trim()}
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}

export function AccountAddressesPage() {
  const { data } = useQuery({ queryKey: ["addresses"], queryFn: getAddresses });
  const items = data?.items || [];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-4xl font-extrabold text-brand-ink">Saved Addresses</h1>
        <button className="rounded-full bg-brand-coral px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">+ Add New</button>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-xl text-slate-500 font-body mb-4">You haven&apos;t saved any addresses yet.</p>
          <button className="rounded-full bg-brand-peach px-6 py-3 font-bold text-brand-coral transition-colors hover:bg-brand-coral hover:text-white">Add Delivery Address</button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((address) => (
            <Card key={address.id} className="relative group hover:border-brand-coral transition-colors">
              {address.isDefault && (
                <span className="absolute top-6 right-6 px-3 py-1 bg-brand-mint text-brand-ink text-xs font-bold rounded-full">Default</span>
              )}
              <h3 className="font-bold text-brand-ink text-lg pr-20">{address.name}</h3>
              <div className="mt-3 text-sm text-slate-600 font-body leading-relaxed">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p className="mt-2 text-slate-500">📞 {address.phone || "No phone added"}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="text-sm font-bold text-brand-coral hover:underline">Edit</button>
                <div className="w-px h-4 bg-slate-200 self-center"></div>
                <button className="text-sm font-bold text-slate-400 hover:text-red-500 hover:underline">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export function WishlistPage() {
  const addItem = useCartStore((state) => state.addItem);
  const { data } = useQuery({ queryKey: ["wishlist"], queryFn: getWishlist });
  const items = data?.items || [];

  return (
    <section className="space-y-6">
      <h1 className="font-display text-4xl font-extrabold text-brand-ink mb-2">My Wishlist</h1>
      
      {!items.length ? (
        <Card className="text-center py-16 border-dashed border-2 bg-orange-50/50">
          <div className="text-6xl mb-4 opacity-50">✨</div>
          <p className="text-xl text-brand-ink font-bold mb-2">Your wishlist is empty</p>
          <p className="text-slate-500 font-body mb-6">Save the toys your little ones love and they will show up here.</p>
          <Link className="inline-block rounded-full bg-brand-coral px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1" to="/shop">
            Explore Toys
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="fade-up">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
