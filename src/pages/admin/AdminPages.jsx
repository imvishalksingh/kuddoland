import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createAdminProduct,
  createCategory,
  createCoupon,
  createShipment,
  deleteAdminProduct,
  deleteCategory,
  deleteCoupon,
  deleteReview,
  getAdminProducts,
  getAnalyticsCategoryBreakdown,
  getAnalyticsOrdersByStatus,
  getAnalyticsRevenue,
  getAnalyticsSummary,
  getAnalyticsTopProducts,
  getCategories,
  getCoupons,
  getReviews,
  getShipments,
  getUsers,
  moderateReview,
  syncShipments,
  toggleUserBan,
  updateAdminProduct,
  updateCategory,
  updateCoupon,
  updateStorefront,
  uploadBulkProducts
} from "../../api/admin.api";
import useDataStore from "../../store/useDataStore";
import { assignShipment, decideReturn, getAdminOrders, getOrder, refundOrder, updateOrderStatus } from "../../api/orders.api";
import { fetchProduct } from "../../api/products.api";
import { uploadAdminImage } from "../../api/upload.api";
import { Button } from "../../components/ui/Button";
import { Seo } from "../../components/ui/Seo";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

function AdminEntry({ title, description, actions, children }) {
  return (
    <div className="space-y-6">
      <Seo title={`${title} | Admin | Kuddosland`} description={description} />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="chip">Admin panel</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-brand-ink">{title}</h1>
          <p className="mt-2 text-slate-600">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

function AdminCard({ title, subtitle, children }) {
  return (
    <div className="panel space-y-4 p-5">
      <div>
        <h2 className="font-semibold text-brand-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-brand-ink">
      <span>{label}</span>
      <input className="w-full rounded-2xl border border-orange-200 px-4 py-3 text-sm font-medium text-slate-700" {...props} />
    </label>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-brand-ink">
      <span>{label}</span>
      <select className="w-full rounded-2xl border border-orange-200 px-4 py-3 text-sm font-medium text-slate-700" {...props}>
        {children}
      </select>
    </label>
  );
}

function TextareaField({ label, ...props }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-brand-ink">
      <span>{label}</span>
      <textarea className="min-h-32 w-full rounded-2xl border border-orange-200 px-4 py-3 text-sm font-medium text-slate-700" {...props} />
    </label>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="panel rounded-[28px] border-dashed p-8 text-center">
      <h3 className="font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

const productInitialState = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  comparePrice: "",
  costPrice: "",
  stock: 0,
  sku: "",
  categoryId: "",
  ageGroup: "3-5",
  brand: "",
  image: "",
  images: [],
  featured: false,
  isActive: true,
};

const couponInitialState = {
  code: "",
  type: "FLAT",
  value: 0,
  minOrderValue: "",
  maxDiscount: "",
  totalUses: "",
  perUserLimit: "",
  isActive: true,
};

const categoryInitialState = {
  name: "",
  slug: "",
  image: "",
};

export function AdminDashboardPage() {
  const { data } = useQuery({ queryKey: ["analytics-summary"], queryFn: getAnalyticsSummary });
  const totals = data?.totals || {};

  return (
    <AdminEntry
      title="Dashboard analytics overview"
      description="Core KPIs for the live catalog, orders, customers, and revenue."
      actions={<Link to="/admin/products/new"><Button>Add product</Button></Link>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenue", value: formatCurrency(totals.revenue) },
          { label: "Orders", value: totals.orders || 0 },
          { label: "Users", value: totals.users || 0 },
          { label: "Products", value: totals.products || 0 },
        ].map((item) => (
          <div key={item.label} className="panel p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">{item.label}</p>
            <p className="mt-3 font-display text-4xl font-extrabold text-brand-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </AdminEntry>
  );
}

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const { data } = useQuery({ queryKey: ["admin-products"], queryFn: getAdminProducts });
  const archiveMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product archived");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Archive failed"),
  });
  
  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const loadingToast = toast.loading("Uploading products via CSV...");
    try {
      const result = await uploadBulkProducts(file);
      toast.success(result.message || `Successfully inserted products!`, { id: loadingToast });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload CSV. Please check format.", { id: loadingToast });
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const items = data?.items || [];

  return (
    <AdminEntry
      title="Catalog management"
      description="Create, edit, feature, and archive products from the live catalog."
      actions={
        <div className="flex items-center gap-3">
          <label className={`cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} disabled={isUploading} />
            <span className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-orange-100 text-[15px] font-bold text-orange-700 transition-colors hover:bg-orange-200">
              Bulk Upload CSV
            </span>
          </label>
          <Link to="/admin/products/new"><Button>Add product</Button></Link>
        </div>
      }
    >
      {!items.length ? <EmptyState title="No products yet" description="Create the first product to populate the catalog." /> : null}
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img className="h-20 w-20 rounded-2xl object-cover" src={item.image || "/cat1.png"} alt={item.name} />
              <div>
                <p className="font-semibold text-brand-ink">{item.name}</p>
                <p className="text-sm text-slate-500">{item.brand} | SKU {item.sku}</p>
                <p className="text-sm text-slate-500">{item.isActive ? "Active" : "Archived"} | Stock {item.stock} | {item.featured ? "Featured" : "Standard"}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="min-w-24 text-sm font-bold text-brand-ink">{formatCurrency(item.price)}</p>
              <Link to={`/admin/products/${item.id}/edit`}><Button variant="secondary">Edit</Button></Link>
              {item.isActive ? <Button variant="secondary" onClick={() => archiveMutation.mutate(item.id)}>Archive</Button> : null}
            </div>
          </div>
        ))}
      </div>
    </AdminEntry>
  );
}

export function AdminProductFormPage() {
  const navigate = useNavigate();
  const params = useParams();
  const isEdit = Boolean(params.id);
  const queryClient = useQueryClient();
  const [form, setForm] = useState(productInitialState);
  const { data: categoriesData } = useQuery({ queryKey: ["admin-categories"], queryFn: getCategories });
  const { data: productData } = useQuery({
    queryKey: ["admin-product", params.id],
    queryFn: () => fetchProduct(params.id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!productData?.item) return;
    const item = productData.item;
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      description: item.description || "",
      price: item.price || 0,
      comparePrice: item.comparePrice || "",
      costPrice: item.costPrice || "",
      stock: item.stock || 0,
      sku: item.sku || "",
      categoryId: item.categoryId || "",
      ageGroup: item.ageGroup || "3-5",
      brand: item.brand || "",
      image: item.image || "",
      images: item.images || [],
      featured: Boolean(item.featured),
      isActive: Boolean(item.isActive),
    });
  }, [productData]);

  const mutation = useMutation({
    mutationFn: (payload) => (isEdit ? updateAdminProduct(params.id, payload) : createAdminProduct(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(isEdit ? "Product updated" : "Product created");
      navigate("/admin/products");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Save failed"),
  });

  const categories = categoriesData?.items || [];
  const uploadMutation = useMutation({
    mutationFn: (file) => uploadAdminImage(file, "product"),
    onSuccess: (response) => {
      setForm((current) => {
        const nextImages = [...current.images, response.url];
        return { 
          ...current, 
          images: nextImages,
          image: current.image || response.url 
        };
      });
      toast.success("Image uploaded");
    },
    onError: (error) => toast.error(error.response?.data?.message || error.message || "Upload failed"),
  });

  return (
    <AdminEntry title={isEdit ? "Edit product" : "Create product"} description="Manage product merchandising, inventory, and storefront visibility.">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard title="Product details">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <Field label="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            <Field label="Brand" value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} />
            <Field label="SKU" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          </div>
          <TextareaField label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </AdminCard>

        <AdminCard title="Pricing and inventory">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Price" type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))} />
            <Field label="Compare price" type="number" value={form.comparePrice} onChange={(event) => setForm((current) => ({ ...current, comparePrice: event.target.value }))} />
            <Field label="Cost price" type="number" value={form.costPrice} onChange={(event) => setForm((current) => ({ ...current, costPrice: event.target.value }))} />
            <Field label="Stock" type="number" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: Number(event.target.value) }))} />
          </div>
        </AdminCard>

        <AdminCard title="Catalog placement">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="Category" value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </SelectField>
            <SelectField label="Age group" value={form.ageGroup} onChange={(event) => setForm((current) => ({ ...current, ageGroup: event.target.value }))}>
              {["0-2", "3-5", "6-8", "9-12", "12+"].map((ageGroup) => (
                <option key={ageGroup} value={ageGroup}>{ageGroup}</option>
              ))}
            </SelectField>
          </div>
          <div className="space-y-4">
            <Field label="Primary image URL" value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} />
            
            {form.images.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-brand-ink">Product Media ({form.images.length})</span>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {form.images.map((url, index) => (
                    <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-2xl border border-orange-100 bg-slate-50 shadow-sm">
                      <img src={url} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt={`Product ${index}`} />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => {
                              const nextImages = prev.images.filter((_, i) => i !== index);
                              return {
                                ...prev,
                                images: nextImages,
                                image: prev.image === url ? (nextImages[0] || "") : prev.image
                              };
                            });
                          }}
                          className="rounded-full bg-red-500 p-2 text-white shadow-lg transition hover:scale-110"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {form.image === url && (
                        <div className="absolute inset-x-0 bottom-0 bg-brand-ink/70 px-1 py-0.5 text-center text-[9px] font-bold text-white uppercase tracking-wider">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <label className="space-y-2 text-sm font-semibold text-brand-ink">
            <span>Upload image</span>
            <input
              className="block w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadMutation.mutate(file);
                }
              }}
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} />
            Featured product
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
            Active on storefront
          </label>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => mutation.mutate({ 
              ...form, 
              comparePrice: form.comparePrice === "" ? null : Number(form.comparePrice), 
              costPrice: form.costPrice === "" ? null : Number(form.costPrice), 
              images: form.images.length ? form.images : (form.image ? [form.image] : [])
            })}>
              {isEdit ? "Update product" : "Create product"}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/admin/products")}>Cancel</Button>
          </div>
        </AdminCard>
      </div>
    </AdminEntry>
  );
}

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-orders"], queryFn: getAdminOrders });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Status update failed"),
  });
  const items = data?.items || [];

  return (
    <AdminEntry title="Order operations" description="Review order state, open details, and update statuses from one place.">
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="panel flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="font-semibold text-brand-ink">{item.id}</p>
              <p className="text-sm text-slate-500">{item.customerName} | {item.status} | {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-bold text-brand-ink">{formatCurrency(item.total)}</p>
              <select className="rounded-full border border-orange-200 px-4 py-2 text-sm" value={item.status} onChange={(event) => statusMutation.mutate({ id: item.id, status: event.target.value })}>
                {["PLACED", "PAYMENT_PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "REFUNDED"].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Link to={`/admin/orders/${item.id}`}><Button variant="secondary">Open</Button></Link>
            </div>
          </div>
        ))}
      </div>
    </AdminEntry>
  );
}

export function AdminOrderDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-order", params.id], queryFn: () => getOrder(params.id) });
  const [shipmentForm, setShipmentForm] = useState({ awb: "", courier: "FShip Express", trackingUrl: "" });
  const [refundAmount, setRefundAmount] = useState("");
  const item = data?.item;

  const updateStatusMutation = useMutation({
    mutationFn: (status) => updateOrderStatus(params.id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", params.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Status update failed"),
  });

  const shipmentMutation = useMutation({
    mutationFn: (payload) => assignShipment(params.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", params.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      toast.success("Shipment assigned");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Shipment assignment failed"),
  });

  const refundMutation = useMutation({
    mutationFn: (payload) => refundOrder(params.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", params.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Refund processed");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Refund failed"),
  });
  const returnDecisionMutation = useMutation({
    mutationFn: (payload) => decideReturn(params.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-order", params.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Return decision saved");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Return decision failed"),
  });

  if (!item) {
    return <AdminEntry title="Order detail" description="Loading order details..." />;
  }

  return (
    <AdminEntry title={`Order ${item.id}`} description="Inspect line items, payment state, shipment status, and fulfillment actions.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminCard title="Order summary">
          <div className="grid gap-2 text-sm text-slate-600">
            <p><span className="font-semibold text-brand-ink">Customer:</span> {item.customerName}</p>
            <p><span className="font-semibold text-brand-ink">Status:</span> {item.status}</p>
            <p><span className="font-semibold text-brand-ink">Total:</span> {formatCurrency(item.total)}</p>
            <p><span className="font-semibold text-brand-ink">Placed:</span> {new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <SelectField label="Update status" value={item.status} onChange={(event) => updateStatusMutation.mutate(event.target.value)}>
            {["PLACED", "PAYMENT_PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "REFUNDED"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </SelectField>
        </AdminCard>

        <AdminCard title="Shipment and refund actions">
          <div className="grid gap-4">
            <Field label="AWB" value={shipmentForm.awb} onChange={(event) => setShipmentForm((current) => ({ ...current, awb: event.target.value }))} />
            <Field label="Courier" value={shipmentForm.courier} onChange={(event) => setShipmentForm((current) => ({ ...current, courier: event.target.value }))} />
            <Field label="Tracking URL" value={shipmentForm.trackingUrl} onChange={(event) => setShipmentForm((current) => ({ ...current, trackingUrl: event.target.value }))} />
            <Button onClick={() => shipmentMutation.mutate(shipmentForm)}>Assign shipment</Button>
          </div>
          <div className="grid gap-4 border-t border-orange-100 pt-4">
            <Field label="Refund amount" type="number" value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)} />
            <Button variant="secondary" onClick={() => refundMutation.mutate({ amount: Number(refundAmount || item.total) })}>Refund order</Button>
          </div>
        </AdminCard>

        <AdminCard title="Line items">
          <div className="space-y-3">
            {item.items.map((orderItem) => (
              <div key={orderItem.id} className="rounded-2xl border border-orange-100 p-4">
                <p className="font-semibold text-brand-ink">{orderItem.productSnapshot?.name || orderItem.productId}</p>
                <p className="mt-1 text-sm text-slate-500">Qty {orderItem.quantity} | {formatCurrency(orderItem.price)}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Payment and shipment">
          <div className="space-y-4 text-sm text-slate-600">
            <p><span className="font-semibold text-brand-ink">Payment:</span> {item.payment?.status || "Not created"}</p>
            <p><span className="font-semibold text-brand-ink">Method:</span> {item.payment?.method || "N/A"}</p>
            <p><span className="font-semibold text-brand-ink">Shipment:</span> {item.shipment?.status || "Not assigned"}</p>
            <p><span className="font-semibold text-brand-ink">AWB:</span> {item.shipment?.awb || "N/A"}</p>
            <p><span className="font-semibold text-brand-ink">Return reason:</span> {item.returnReason || "N/A"}</p>
            <p><span className="font-semibold text-brand-ink">Return details:</span> {item.returnDetails || "N/A"}</p>
            <p><span className="font-semibold text-brand-ink">Return decision note:</span> {item.returnDecisionNote || "N/A"}</p>
            {item.status === "RETURN_REQUESTED" ? (
              <div className="flex flex-wrap gap-3 pt-3">
                <Button variant="secondary" onClick={() => returnDecisionMutation.mutate({ action: "approve", note: "Approved from admin dashboard" })}>Approve return</Button>
                <Button variant="secondary" onClick={() => returnDecisionMutation.mutate({ action: "reject", note: "Rejected from admin dashboard" })}>Reject return</Button>
              </div>
            ) : null}
          </div>
        </AdminCard>
      </div>
    </AdminEntry>
  );
}

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-users"], queryFn: getUsers });
  const mutation = useMutation({
    mutationFn: toggleUserBan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated");
    },
    onError: (error) => toast.error(error.response?.data?.message || "User update failed"),
  });
  const items = data?.items || [];

  return (
    <AdminEntry title="Customer management" description="Monitor account state, verification status, and moderation controls.">
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-brand-ink">{item.name}</p>
              <p className="text-sm text-slate-500">{item.email} | {item.role}</p>
              <p className="text-sm text-slate-500">{item.isVerified ? "Verified" : "Unverified"} | {item.orderCount} orders</p>
            </div>
            <Button variant="secondary" onClick={() => mutation.mutate(item.id)}>{item.isBanned ? "Unban" : "Ban"}</Button>
          </div>
        ))}
      </div>
    </AdminEntry>
  );
}

export function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(couponInitialState);
  const { data } = useQuery({ queryKey: ["admin-coupons"], queryFn: getCoupons });
  const saveMutation = useMutation({
    mutationFn: (payload) => (editing ? updateCoupon(editing.id, payload) : createCoupon(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setEditing(null);
      setForm(couponInitialState);
      toast.success("Coupon saved");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Coupon save failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Coupon delete failed"),
  });
  const items = data?.items || [];

  return (
    <AdminEntry title="Coupon manager" description="Create, update, and retire coupon campaigns without leaving the dashboard.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCard title={editing ? "Edit coupon" : "Create coupon"}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Code" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))} />
            <SelectField label="Type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
              <option value="FLAT">FLAT</option>
              <option value="PERCENT">PERCENT</option>
            </SelectField>
            <Field label="Value" type="number" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: Number(event.target.value) }))} />
            <Field label="Min order value" type="number" value={form.minOrderValue} onChange={(event) => setForm((current) => ({ ...current, minOrderValue: event.target.value }))} />
            <Field label="Max discount" type="number" value={form.maxDiscount} onChange={(event) => setForm((current) => ({ ...current, maxDiscount: event.target.value }))} />
            <Field label="Total uses" type="number" value={form.totalUses} onChange={(event) => setForm((current) => ({ ...current, totalUses: event.target.value }))} />
            <Field label="Per user limit" type="number" value={form.perUserLimit} onChange={(event) => setForm((current) => ({ ...current, perUserLimit: event.target.value }))} />
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold text-brand-ink">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
            Coupon active
          </label>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => saveMutation.mutate({ ...form, minOrderValue: form.minOrderValue === "" ? null : Number(form.minOrderValue), maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount), totalUses: form.totalUses === "" ? null : Number(form.totalUses), perUserLimit: form.perUserLimit === "" ? null : Number(form.perUserLimit) })}>
              {editing ? "Update coupon" : "Create coupon"}
            </Button>
            {editing ? <Button variant="secondary" onClick={() => { setEditing(null); setForm(couponInitialState); }}>Cancel edit</Button> : null}
          </div>
        </AdminCard>

        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-brand-ink">{item.code}</p>
                <p className="text-sm text-slate-500">{item.type} | Value {item.value} | Used {item.usedCount}</p>
                <p className="text-sm text-slate-500">{item.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => { setEditing(item); setForm({ code: item.code, type: item.type, value: item.value, minOrderValue: item.minOrderValue || "", maxDiscount: item.maxDiscount || "", totalUses: item.totalUses || "", perUserLimit: item.perUserLimit || "", isActive: item.isActive }); }}>Edit</Button>
                <Button variant="secondary" onClick={() => deleteMutation.mutate(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminEntry>
  );
}

export function AdminShipmentsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ orderId: "", awb: "", courier: "FShip Express", trackingUrl: "" });
  const { data } = useQuery({ queryKey: ["admin-shipments"], queryFn: getShipments });
  const createMutation = useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Shipment created");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Shipment create failed"),
  });
  const syncMutation = useMutation({
    mutationFn: syncShipments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      toast.success("Shipments synced");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Shipment sync failed"),
  });
  const items = data?.items || [];

  return (
    <AdminEntry title="Shipment operations" description="Assign and inspect shipment records while FShip integration is being finished." actions={<Button variant="secondary" onClick={() => syncMutation.mutate()}>Sync shipments</Button>}>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCard title="Create shipment">
          <div className="grid gap-4">
            <Field label="Order ID" value={form.orderId} onChange={(event) => setForm((current) => ({ ...current, orderId: event.target.value }))} />
            <Field label="AWB" value={form.awb} onChange={(event) => setForm((current) => ({ ...current, awb: event.target.value }))} />
            <Field label="Courier" value={form.courier} onChange={(event) => setForm((current) => ({ ...current, courier: event.target.value }))} />
            <Field label="Tracking URL" value={form.trackingUrl} onChange={(event) => setForm((current) => ({ ...current, trackingUrl: event.target.value }))} />
            <Button onClick={() => createMutation.mutate(form)}>Create shipment</Button>
          </div>
        </AdminCard>

        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="panel flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-brand-ink">{item.orderId}</p>
                <p className="text-sm text-slate-500">{item.courier || "Courier pending"} | {item.status}</p>
                <p className="text-sm text-slate-500">{item.awb || "No AWB yet"}</p>
              </div>
              {item.trackingUrl ? <a className="text-sm font-bold text-orange-500" href={item.trackingUrl} target="_blank" rel="noreferrer">Tracking link</a> : null}
            </div>
          ))}
        </div>
      </div>
    </AdminEntry>
  );
}

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(categoryInitialState);
  const { data } = useQuery({ queryKey: ["admin-categories"], queryFn: getCategories });
  const saveMutation = useMutation({
    mutationFn: (payload) => (editing ? updateCategory(editing.id, payload) : createCategory(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setEditing(null);
      setForm(categoryInitialState);
      toast.success("Category saved");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Category save failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Category delete failed"),
  });
  const items = data?.items || [];

  return (
    <AdminEntry title="Category curation" description="Maintain your storefront taxonomy and collection structure.">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <AdminCard title={editing ? "Edit category" : "Create category"}>
          <div className="grid gap-4">
            <Field label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <Field label="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            <Field label="Image URL" value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => saveMutation.mutate(form)}>{editing ? "Update category" : "Create category"}</Button>
              {editing ? <Button variant="secondary" onClick={() => { setEditing(null); setForm(categoryInitialState); }}>Cancel edit</Button> : null}
            </div>
          </div>
        </AdminCard>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="panel p-5">
              <p className="font-semibold text-brand-ink">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500">{item.slug}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => { setEditing(item); setForm({ name: item.name, slug: item.slug, image: item.image || "" }); }}>Edit</Button>
                <Button variant="secondary" onClick={() => deleteMutation.mutate(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminEntry>
  );
}

export function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-reviews"], queryFn: getReviews });
  const moderateMutation = useMutation({
    mutationFn: ({ id, action }) => moderateReview(id, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review updated");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Moderation failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Delete failed"),
  });
  const items = data?.items || [];

  return (
    <AdminEntry title="Review moderation" description="Approve, reject, and remove customer reviews from the live catalog.">
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="panel p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold text-brand-ink">{item.product?.name || "Product removed"}</p>
                <p className="text-sm text-slate-500">{item.user?.name || item.user?.email || "Unknown user"} | Rating {item.rating}</p>
                <p className="mt-3 font-semibold text-brand-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => moderateMutation.mutate({ id: item.id, action: "approve" })}>Approve</Button>
                <Button variant="secondary" onClick={() => moderateMutation.mutate({ id: item.id, action: "reject" })}>Reject</Button>
                <Button variant="secondary" onClick={() => deleteMutation.mutate(item.id)}>Delete</Button>
              </div>
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-orange-500">{item.isApproved ? "Approved" : "Pending"}</p>
          </div>
        ))}
      </div>
    </AdminEntry>
  );
}

export function AdminAnalyticsPage() {
  const { data: summary } = useQuery({ queryKey: ["analytics-summary"], queryFn: getAnalyticsSummary });
  const { data: revenue } = useQuery({ queryKey: ["analytics-revenue"], queryFn: getAnalyticsRevenue });
  const { data: topProducts } = useQuery({ queryKey: ["analytics-top-products"], queryFn: getAnalyticsTopProducts });
  const { data: ordersByStatus } = useQuery({ queryKey: ["analytics-orders-by-status"], queryFn: getAnalyticsOrdersByStatus });
  const { data: categoryBreakdown } = useQuery({ queryKey: ["analytics-category-breakdown"], queryFn: getAnalyticsCategoryBreakdown });

  return (
    <AdminEntry title="Analytics and reporting" description="Operational reporting across revenue, product velocity, order health, and category mix.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenue", value: formatCurrency(summary?.totals?.revenue) },
          { label: "Orders", value: summary?.totals?.orders || 0 },
          { label: "Users", value: summary?.totals?.users || 0 },
          { label: "Products", value: summary?.totals?.products || 0 },
        ].map((item) => (
          <div key={item.label} className="panel p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">{item.label}</p>
            <p className="mt-3 font-display text-4xl font-extrabold text-brand-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminCard title="Revenue feed" subtitle="Latest order revenue snapshots">
          <div className="space-y-3">
            {(revenue?.items || []).slice(-8).reverse().map((item) => (
              <div key={`${item.date}-${item.total}`} className="flex items-center justify-between rounded-2xl border border-orange-100 px-4 py-3 text-sm">
                <span className="font-medium text-slate-600">{item.date}</span>
                <span className="font-bold text-brand-ink">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Top products" subtitle="Best-selling catalog items">
          <div className="space-y-3">
            {(topProducts?.items || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-orange-100 px-4 py-3 text-sm">
                <span className="font-medium text-slate-600">{item.name}</span>
                <span className="font-bold text-brand-ink">{item.soldCount} sold</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Orders by status">
          <div className="space-y-3">
            {(ordersByStatus?.items || []).map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-2xl border border-orange-100 px-4 py-3 text-sm">
                <span className="font-medium text-slate-600">{item.status}</span>
                <span className="font-bold text-brand-ink">{item.count}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Category mix">
          <div className="space-y-3">
            {(categoryBreakdown?.items || []).map((item) => (
              <div key={item.category} className="flex items-center justify-between rounded-2xl border border-orange-100 px-4 py-3 text-sm">
                <span className="font-medium text-slate-600">{item.category}</span>
                <span className="font-bold text-brand-ink">{item.count}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminEntry>
  );
}

export function AdminStorefrontSettingsPage() {
  const { storefront, fetchStorefront } = useDataStore();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetchStorefront();
  }, [fetchStorefront]);

  useEffect(() => {
    if (storefront) {
      setForm(JSON.parse(JSON.stringify(storefront)));
    }
  }, [storefront]);

  const saveMutation = useMutation({
    mutationFn: updateStorefront,
    onSuccess: () => {
      fetchStorefront(); // refresh global state
      toast.success("Storefront settings updated");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update settings"),
  });

  if (!form) return <AdminEntry title="Loading settings..." description="Fetching storefront configuration" />;

  return (
    <AdminEntry
      title="Storefront Settings"
      description="Manage top bar messages, social links, headers, hero sliders, homepage sections, and footer directly."
      actions={<Button onClick={() => saveMutation.mutate(form)}>Save All Settings</Button>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <AdminCard title="General & Social Links">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Support Email" value={form.supportEmail || ""} onChange={e => setForm({ ...form, supportEmail: e.target.value })} />
              <Field label="WhatsApp Number" value={form.whatsappNumber || ""} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} />
              <Field label="Facebook" value={form.socialLinks?.facebook || ""} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} />
              <Field label="Instagram" value={form.socialLinks?.instagram || ""} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} />
              <Field label="YouTube" value={form.socialLinks?.youtube || ""} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: e.target.value } })} />
              <Field label="Twitter" value={form.socialLinks?.twitter || ""} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })} />
              <Field label="Pinterest" value={form.socialLinks?.pinterest || ""} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, pinterest: e.target.value } })} />
            </div>
          </AdminCard>

          <AdminCard title="Top Bar Messages">
            {form.topBarMessages?.map((msg, i) => (
              <div key={i} className="flex gap-2 items-end mb-2">
                <div className="flex-1">
                  <Field label={`Message ${i + 1}`} value={msg} onChange={e => {
                    const next = [...form.topBarMessages];
                    next[i] = e.target.value;
                    setForm({ ...form, topBarMessages: next });
                  }} />
                </div>
              </div>
            ))}
          </AdminCard>

          <AdminCard title="Hero Sliders">
            {form.heroSliders?.map((slider, index) => (
              <div key={index} className="space-y-4 border-b border-orange-100 pb-4 mb-4">
                <h4 className="font-semibold text-brand-ink">Slider {index + 1}</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Heading" value={slider.heading} onChange={e => {
                    const next = [...form.heroSliders];
                    next[index].heading = e.target.value;
                    setForm({ ...form, heroSliders: next });
                  }} />
                  <Field label="Subheading" value={slider.subheading} onChange={e => {
                    const next = [...form.heroSliders];
                    next[index].subheading = e.target.value;
                    setForm({ ...form, heroSliders: next });
                  }} />
                  <Field label="Price / Code Text" value={slider.price} onChange={e => {
                    const next = [...form.heroSliders];
                    next[index].price = e.target.value;
                    setForm({ ...form, heroSliders: next });
                  }} />
                  <Field label="CTA Text" value={slider.ctaText} onChange={e => {
                    const next = [...form.heroSliders];
                    next[index].ctaText = e.target.value;
                    setForm({ ...form, heroSliders: next });
                  }} />
                  <Field label="CTA URL" value={slider.ctaUrl} onChange={e => {
                    const next = [...form.heroSliders];
                    next[index].ctaUrl = e.target.value;
                    setForm({ ...form, heroSliders: next });
                  }} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Slider Image</label>
                    <div className="flex items-center gap-4">
                      {slider.image ? (
                        <div className="h-16 w-24 shrink-0 rounded-md border border-slate-200 overflow-hidden bg-slate-50 relative">
                          <img src={slider.image} alt="Slider" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...form.heroSliders];
                              next[index].image = "";
                              setForm({ ...form, heroSliders: next });
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ) : (
                        <div className="h-16 w-24 shrink-0 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">No Image</div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-peach file:text-brand-coral hover:file:bg-orange-100 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            try {
                              const toastId = toast.loading("Uploading image...");
                              const res = await uploadAdminImage(file, "storefront");
                              const next = [...form.heroSliders];
                              next[index].image = res.url || res.data?.url || res; // depending on response shape
                              if (typeof res === "string") next[index].image = res; // If backend returns raw string url
                              setForm({ ...form, heroSliders: next });
                              toast.dismiss(toastId);
                              toast.success("Image uploaded!");
                            } catch (err) {
                              toast.dismiss();
                              toast.error("Upload failed");
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Homepage Section Headings">
            <div className="grid gap-4">
              <Field label="Special Offer Heading" value={form.homeSections?.specialOfferHeading || ""} onChange={e => setForm({ ...form, homeSections: { ...form.homeSections, specialOfferHeading: e.target.value } })} />
              <Field label="Top Picks Heading" value={form.homeSections?.topPicksHeading || ""} onChange={e => setForm({ ...form, homeSections: { ...form.homeSections, topPicksHeading: e.target.value } })} />
              <Field label="New Arrivals Heading" value={form.homeSections?.newArrivalsHeading || ""} onChange={e => setForm({ ...form, homeSections: { ...form.homeSections, newArrivalsHeading: e.target.value } })} />
              <Field label="Top Brands Heading" value={form.homeSections?.topBrandsHeading || ""} onChange={e => setForm({ ...form, homeSections: { ...form.homeSections, topBrandsHeading: e.target.value } })} />
            </div>
          </AdminCard>
          
          <AdminCard title="Footer Columns (JSON raw edit)">
            <TextareaField 
              label="Edit footer data array" 
              value={JSON.stringify(form.footerColumns, null, 2)} 
              onChange={e => {
                try {
                  const val = JSON.parse(e.target.value);
                  setForm({ ...form, footerColumns: val });
                } catch(err) {
                  // ignore parse error while typing
                }
              }} 
            />
          </AdminCard>
        </div>
      </div>
    </AdminEntry>
  );
}
