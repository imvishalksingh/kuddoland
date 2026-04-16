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
  <div className={`rounded-[28px] border border-brand-peach/40 bg-white/80 p-8 shadow-premium backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full rounded-2xl border border-slate-100 bg-white px-5 py-3.5 font-body text-slate-700 transition-all focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/5 focus:outline-none placeholder:text-slate-300"
  />
);

export function AccountPage() {
  const { data } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const [form, setForm] = useState({ name: data?.user?.name || "", phone: data?.user?.phone || "", address: "" });

  useEffect(() => {
    if (data?.user) {
      setForm({ name: data.user.name || "", phone: data.user.phone || "", address: "Lucknow" }); // Mock address for UI mapping
    }
  }, [data]);

  return (
    <section className="space-y-6">
      <Card className="space-y-6 p-8 rounded-2xl shadow-sm border border-slate-200 bg-white">
        <h2 className="font-sans text-[22px] font-bold text-[#001738]">Information</h2>
        
        {/* Profile Picture Block */}
        <div className="grid gap-2">
          <label className="block text-[14px] text-[#4d5e75]">Profile Picture:</label>
          <div className="flex items-center gap-6 mt-1">
            <img src={data?.user?.avatar || "/cat1.png"} alt="Profile preview" className="w-[84px] h-[84px] rounded-lg object-cover border border-slate-200" />
            <div>
              <p className="font-semibold text-sm mb-2 text-[#001738]">Upload File:</p>
              <div className="flex items-center gap-4">
                <button className="bg-white hover:bg-slate-50 active:bg-slate-100 transition-all text-[#001738] text-[13px] font-bold px-5 py-2.5 rounded-lg border border-slate-300 shadow-sm cursor-pointer whitespace-nowrap">
                  CHOOSE FILE
                </button>
                <span className="text-[13px] text-[#8e9aab]">No file chosen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 mt-4">
          <div>
            <label className="block text-[14px] font-bold text-[#4d5e75] mb-2 uppercase tracking-tight">Account ID</label>
            <div className="w-full rounded-md bg-slate-50 border border-slate-200 px-4 py-3.5 text-[14px] text-[#4d5e75] cursor-not-allowed font-semibold">
              KDL-USR-2026
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[#4d5e75] mb-2 uppercase tracking-tight">Full Name</label>
            <input 
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-3.5 text-[14px] font-semibold text-[#001738] transition-all focus:border-black focus:ring-0 focus:outline-none placeholder:text-slate-300"
              value={form.name} 
              placeholder="Your full name"
              onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} 
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-[14px] font-bold text-[#4d5e75] mb-2 uppercase tracking-tight">Phone Number</label>
              <input 
                className="w-full rounded-md border border-slate-300 bg-slate-50/50 px-4 py-3.5 text-[14px] font-semibold text-[#8e9aab] transition-all focus:outline-none cursor-default"
                value={form.phone} 
                readOnly
              />
              <p className="text-[11px] text-[#8e9aab] mt-2 font-medium">Contact support to change your verified number</p>
            </div>
            <div>
              <label className="block text-[14px] font-bold text-[#4d5e75] mb-2 uppercase tracking-tight">Email Address</label>
              <input 
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3.5 text-[14px] text-[#001738] font-semibold transition-all focus:border-black focus:ring-0 focus:outline-none"
                value={data?.user?.email || ""} 
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-[#4d5e75] mb-2 uppercase tracking-tight">Primary Address</label>
            <textarea 
              className="w-full min-h-[120px] rounded-md border border-slate-300 bg-white p-4 text-[14px] text-[#001738] font-semibold transition-all focus:border-black focus:ring-0 focus:outline-none resize-none placeholder:text-slate-300"
              value={form.address} 
              placeholder="Enter your complete address..."
              onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))} 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button 
            className="rounded-lg bg-black px-10 py-4 text-[14px] font-black tracking-widest text-white transition-all hover:bg-slate-800 active:scale-[0.98] shadow-lg shadow-black/10 active:shadow-inner" 
            onClick={() => updateProfile(form)}
          >
            SAVE CHANGES
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
        eyebrow="My Account"
        title="No orders yet"
        description="Place your first order to see it appear in your history."
        highlights={[
          { label: "Timeline", title: "Real-time updates", body: "Follow your order from placement to doorstep with live status tracking." },
          { label: "Assistance", title: "Easy returns", body: "Manage exchanges and returns directly from your order detail page." },
        ]}
      />
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-black text-[#001738] tracking-tight">Order History</h1>
        <p className="text-[#4d5e75] text-[15px] mt-1 font-medium">Review and track your recent purchases.</p>
      </div>
      
      <div className="space-y-4">
        {items.map((order) => (
          <Card key={order.id} className="group p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <p className="text-[11px] font-black text-[#4d5e75] uppercase tracking-widest">#{order.id}</p>
                   <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-[#001738]/5 text-[#001738] tracking-wider">
                     {order.status}
                   </span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[12px] text-[#4d5e75] font-bold uppercase tracking-tight">Purchased on</p>
                    <p className="font-bold text-[#001738] text-[15px]">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
                  <div>
                    <p className="text-[12px] text-[#4d5e75] font-bold uppercase tracking-tight">Total Amount</p>
                    <p className="font-black text-[#001738] text-[15px]">₹{order.total}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link 
                  className="inline-flex items-center justify-center bg-black hover:bg-slate-800 text-white text-[12px] font-black tracking-widest px-8 py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-black/5" 
                  to={`/account/orders/${order.id}`}
                >
                  VIEW DETAILS
                </Link>
              </div>
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
        <Card className="animate-pulse p-8">
          <div className="h-8 bg-slate-100 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-slate-100 rounded w-1/4"></div>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-black text-[#001738] tracking-tight">Order Details</h1>
          <p className="text-[#4d5e75] text-[15px] mt-1 font-medium italic">#{item.id}</p>
        </div>
        <Link 
          to="/account/orders" 
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 px-5 py-2.5 rounded-lg text-[13px] font-bold text-[#001738] shadow-sm transition-all active:scale-[0.98]"
        >
          <span className="text-base">←</span> BACK TO ORDERS
        </Link>
      </div>

      {/* Overview Card */}
      <Card className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-[12px] font-black text-[#4d5e75] uppercase tracking-widest mb-3">Order Information</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#4d5e75]">Placed:</span>
                <span className="font-bold text-[#001738]">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#4d5e75]">Total:</span>
                <span className="font-black text-[#001738]">₹{item.total}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-black text-[#4d5e75] uppercase tracking-widest mb-3">Status Tracking</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#4d5e75]">Order Status:</span>
                <span className="px-2.5 py-1 text-[11px] font-black uppercase rounded bg-slate-100 text-[#001738] tracking-wider">
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#4d5e75]">Payment:</span>
                <span className="font-bold text-[#001738]">{item.payment?.status || "Pending"}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-black text-[#4d5e75] uppercase tracking-widest mb-3">Shipment</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#4d5e75]">Provider:</span>
                <span className="font-bold text-[#001738]">{item.shipment?.courier || "FShip Express"}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#4d5e75]">Tracking:</span>
                <span className="font-bold text-[#001738] italic">{item.shipment?.awb || "Processing"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Items List */}
      <Card className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <h2 className="text-[12px] font-black text-[#4d5e75] uppercase tracking-widest mb-6">Line Items</h2>
        <div className="divide-y divide-slate-100 -mx-8 sm:mx-0 font-sans">
          {item.items.map((orderItem) => (
            <div key={orderItem.id} className="py-6 flex items-center justify-between px-8 sm:px-0 first:pt-0 last:pb-0">
              <div className="flex items-center gap-6">
                <div className="relative h-20 w-20 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                  <img 
                    src={orderItem.productSnapshot?.image || "/cat1.png"} 
                    alt={orderItem.productSnapshot?.name} 
                    className="h-full w-full object-contain mix-blend-multiply transition-transform hover:scale-110" 
                  />
                  <span className="absolute -top-2 -right-2 bg-[#001738] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    {orderItem.quantity}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-[#001738] text-lg leading-tight uppercase tracking-tight">
                    {orderItem.productSnapshot?.name || "Product Item"}
                  </p>
                  <p className="text-[13px] text-[#4d5e75] mt-1 font-medium">SKU: {orderItem.productSnapshot?.sku || "KDL-DEMO"}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="font-black text-[#001738] text-[17px]">₹{orderItem.price}</p>
                 <p className="text-[11px] text-[#4d5e75] font-bold uppercase mt-1 tracking-wider opacity-60">Price per unit</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Return Section - Updated to Professional Styling */}
      {item.status !== "RETURN_REQUESTED" && item.status !== "REFUNDED" && item.status !== "CANCELLED" && (
        <Card className="p-8 rounded-2xl border border-slate-200 bg-[#f9fafb] shadow-sm">
          <h2 className="font-sans text-[20px] font-black text-[#001738] mb-2 uppercase tracking-tight text-center sm:text-left">Returns & Exchanges</h2>
          <p className="text-[#4d5e75] text-[14px] font-medium mb-8 text-center sm:text-left">Not satisfied? Request a return within 7 days of delivery.</p>
          
          <div className="max-w-xl space-y-5 mx-auto sm:mx-0">
            <div>
              <label className="block text-[11px] font-black text-[#4d5e75] mb-2 uppercase tracking-widest pl-1">Reason for return</label>
              <input 
                className="w-full rounded-lg border border-slate-300 bg-white px-5 py-4 text-[14px] font-semibold text-[#001738] transition-all focus:border-black focus:outline-none placeholder:text-slate-300 shadow-sm"
                placeholder="e.g. Damaged item, Wrong size..." 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-[#4d5e75] mb-2 uppercase tracking-widest pl-1">Additional details</label>
              <textarea 
                className="min-h-[140px] w-full rounded-lg border border-slate-300 bg-white px-5 py-4 text-[14px] font-semibold text-[#001738] focus:border-black focus:outline-none placeholder:text-slate-300 resize-none shadow-sm"
                placeholder="Describe your issue in detail..." 
                value={details} 
                onChange={(e) => setDetails(e.target.value)} 
              />
            </div>
            <div className="pt-4 flex justify-center sm:justify-start">
              <button
                className="rounded-lg bg-black px-12 py-4 text-[14px] font-black tracking-[0.2em] text-white shadow-xl shadow-black/10 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-30"
                onClick={() => mutation.mutate({ reason, details })}
                disabled={!reason.trim()}
              >
                SUBMIT RETURN
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Return Information (If already requested) */}
      {item.returnReason && (
        <Card className="p-8 rounded-2xl border border-amber-200 bg-amber-50/30">
          <h2 className="font-sans text-[18px] font-black text-amber-900 mb-4 uppercase tracking-tight">Return Request Status</h2>
          <div className="grid gap-6 sm:grid-cols-2 text-[14px] font-medium text-amber-900/80">
            <div>
              <p className="font-black text-amber-900 uppercase text-[11px] tracking-widest mb-1">Reason provided</p>
              <p className="italic underline underline-offset-4 decoration-amber-200">{item.returnReason}</p>
            </div>
            <div>
              <p className="font-black text-amber-900 uppercase text-[11px] tracking-widest mb-1">Admin Resolution</p>
              <p>{item.returnDecisionNote || "Our team is reviewing your request. Expect an update within 48 hours."}</p>
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
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl font-black text-[#001738] tracking-tight">Saved Addresses</h1>
          <p className="text-[#4d5e75] text-[15px] mt-1 font-medium">Manage your delivery locations for faster checkout.</p>
        </div>
        <button className="bg-black hover:bg-slate-800 text-white text-[12px] font-black tracking-widest px-8 py-3.5 rounded-lg active:scale-[0.98] shadow-lg shadow-black/5 transition-all">
          ADD NEW ADDRESS
        </button>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-20 border-slate-200 border bg-white rounded-2xl">
          <p className="text-xl text-[#001738] font-bold mb-4">You haven&apos;t saved any addresses yet.</p>
          <button className="bg-black hover:bg-slate-800 text-white text-[12px] font-black tracking-widest px-8 py-3.5 rounded-lg transition-all">
            CREATE FIRST ADDRESS
          </button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((address) => (
            <Card key={address.id} className="relative p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                {address.isDefault && (
                  <span className="absolute top-6 right-6 px-2.5 py-1 bg-[#001738] text-white text-[9px] font-black uppercase tracking-widest rounded shadow-sm">Default</span>
                )}
                <h3 className="font-black text-[#001738] text-[16px] uppercase tracking-tight pr-20">{address.name}</h3>
                <div className="mt-4 text-[14px] text-[#4d5e75] font-medium leading-relaxed">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p className="font-bold text-[#001738] mt-1">{address.city}, {address.state} - {address.pincode}</p>
                  <p className="mt-4 flex items-center gap-2 opacity-70">
                    <span className="text-[11px] font-black uppercase tracking-wider">Phone:</span> {address.phone || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex gap-4">
                <button className="text-[12px] font-black text-[#001738] hover:underline tracking-widest uppercase">Edit</button>
                <div className="w-px h-3 bg-slate-200 self-center"></div>
                <button className="text-[12px] font-black text-red-500 hover:underline tracking-widest uppercase">Delete</button>
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
    <section className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-black text-[#001738] tracking-tight">My Wishlist</h1>
        <p className="text-[#4d5e75] text-[15px] mt-1 font-medium">Items you've saved for later play sessions.</p>
      </div>

      {!items.length ? (
        <Card className="text-center py-20 border-slate-200 border-2 border-dashed bg-slate-50/50 rounded-2xl">
          <div className="text-5xl mb-6 opacity-40">✨</div>
          <p className="text-xl text-[#001738] font-black mb-2 tracking-tight">Your wishlist is currently empty</p>
          <p className="text-[#4d5e75] text-[15px] mb-8 font-medium italic">Save your favorite toys here to find them faster!</p>
          <Link 
            className="inline-flex items-center justify-center bg-black hover:bg-slate-800 text-white text-[12px] font-black tracking-widest px-10 py-4 rounded-lg transition-all shadow-lg shadow-black/10" 
            to="/shop"
          >
            CONTINUE SHOPPING
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="fade-up transition-transform hover:-translate-y-1">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
