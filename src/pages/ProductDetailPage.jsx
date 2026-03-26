import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductCard } from "../components/shop/ProductCard";
import { Seo } from "../components/ui/Seo";
import { useProducts, useProduct } from "../hooks/useProducts";
import { useWishlist } from "../hooks/useWishlist";
import { useCartStore } from "../store/cartStore";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M12 20.5c-4.8-3.4-8-6.1-8-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3.5c0 3.9-3.2 6.6-8 10Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CompareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M7 16V4m0 0L4 7m3-3l3 3M17 8v12m0 0l3-3m-3 3l-3-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReturnIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 4v5h5M4.582 9A8 8 0 1112 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Accordion with circle arrow icon matching reference
const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-dashed border-slate-200 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-4 bg-white text-left text-[15px] font-semibold text-brand-ink hover:text-[#ff8b87] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className={`w-7 h-7 rounded-full border border-current flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${open ? "rotate-45" : ""}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M5 15l7-7 7 7"} />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-4 text-[13px] leading-relaxed text-slate-500">{children}</div>
      )}
    </div>
  );
};

const COLORS = [
  { name: "Brown", hex: "#8B4513" },
  { name: "White", hex: "#EEEEEE" },
  { name: "Red", hex: "#E53E3E" },
  { name: "Pink", hex: "#FFB6C1" },
];
const WEIGHTS = ["80 g", "90 g", "250 g", "100 g"];
const MATERIALS = ["Cotton", "Fur", "Polyester", "Mohair"];

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: queryData, isLoading } = useProduct(slug);
  const { data: products = [] } = useProducts();
  const product = queryData?.item;

  const addItem = useCartStore((state) => state.addItem);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("Brown");
  const [selectedWeight, setSelectedWeight] = useState("80 g");
  const [selectedMaterial, setSelectedMaterial] = useState("Cotton");
  const [stickyVisible, setStickyVisible] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStickyVisible(y > 500);
      setScrolled(y > 300);
      if (y < 100) setStickyDismissed(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Reset selections when product changes
    if (product) {
      setSelectedImage("");
      setSelectedColor("Brown");
    }
  }, [product?.id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return product.images?.length ? product.images : [product.image].filter(Boolean);
  }, [product]);

  const related = useMemo(
    () => products.filter((p) => p.id !== product?.id).slice(0, 4),
    [product?.id, products]
  );

  // If we have literally nothing (no cache, no mock), show a full-page pulse
  if (!product && isLoading) {
    return (
      <div className="page-shell py-10 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="h-[400px] bg-slate-100 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-slate-100" />
            <div className="h-6 w-1/4 bg-slate-100" />
            <div className="h-24 bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const mainImage = selectedImage || gallery[0] || product.image || "/cat1.png";

  const handleAddToCart = () => addItem(product, quantity);
  const handleBuyNow = () => { addItem(product, quantity); navigate("/checkout"); };

  return (
    <main className="bg-white min-h-screen">
      <Seo title={`${product.name} | Kuddosland`} description={product.description} />

      {/* ── Main 2‑col PDP ── */}
      <div className="page-shell py-5 sm:py-8 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-start">

          {/* LEFT — Gallery (sticky only on desktop) */}
          <div className="lg:sticky lg:top-28 flex flex-col gap-4">
            {/* Main image */}
            <div className="w-full rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden min-h-[260px] sm:min-h-[360px] p-4">
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-[420px] lg:max-h-[480px] w-full object-contain mix-blend-multiply transition-all duration-300"
              />
            </div>
            {/* Horizontal thumbnails on mobile, horizontal on all sizes */}
            <div className="flex flex-row gap-3 overflow-x-auto pb-1">
              {gallery.map((img) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-[62px] h-[62px] sm:w-[68px] sm:h-[68px] rounded-xl border-2 p-1 transition-all ${mainImage === img ? "border-slate-700" : "border-slate-100 hover:border-slate-300"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product info */}
          <div className="space-y-5 min-w-0">
            {/* Title + desc + stars + price */}
            <div>
              <h1 className="text-2xl font-bold text-brand-ink font-display mb-2">{product.name}</h1>
              <p className="text-slate-500 text-[14px] leading-relaxed line-clamp-2">
                {product.description || "A wonderful addition to your collection..."}
              </p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex text-amber-400">
                  <span className="text-sm">★★★★★</span>
                </div>
                <span className="text-slate-400 text-xs">(4.8 / 5.0)</span>
              </div>
              
              <div className="mt-4 text-2xl font-bold text-brand-ink">
                {formatCurrency(product.price)}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="text-[13px] font-bold text-brand-ink mb-2">
                Color: <span className="font-normal text-slate-500">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-md border-2 transition-all ${selectedColor === c.name ? "ring-2 ring-brand-ink ring-offset-2 border-transparent" : "border-slate-200"}`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <p className="text-[13px] font-bold text-brand-ink mb-2">
                Weight: <span className="font-normal text-slate-500">{selectedWeight}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {WEIGHTS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedWeight === w ? "bg-brand-ink text-white border-brand-ink" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <p className="text-[13px] font-bold text-brand-ink mb-2">
                Material: <span className="font-normal text-slate-500">{selectedMaterial}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {MATERIALS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedMaterial === m ? "bg-brand-ink text-white border-brand-ink" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to Cart + Wishlist + Compare — all in ONE row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Qty stepper */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-[44px] text-sm font-bold flex-shrink-0">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 h-full text-slate-400 hover:bg-slate-50 transition-colors select-none">−</button>
                <span className="px-4 text-brand-ink">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-4 h-full text-slate-400 hover:bg-slate-50 transition-colors select-none">+</button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-0 h-[44px] rounded-xl bg-[#ff8b87] text-white text-sm font-bold hover:bg-[#ff7777] transition-colors"
              >
                Add to cart
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-[42px] h-[42px] rounded-xl border flex items-center justify-center transition-all ${isWishlisted(product.id) ? "bg-[#ff8b87] border-[#ff8b87] text-white" : "border-slate-200 text-slate-500 hover:border-slate-400 bg-white"}`}
                aria-label="Wishlist"
              >
                <HeartIcon filled={isWishlisted(product.id)} />
              </button>

              {/* Compare */}
              <button
                className="w-[42px] h-[42px] rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 bg-white transition-all"
                aria-label="Compare"
              >
                <CompareIcon />
              </button>
            </div>

            {/* Buy it now */}
            <button
              onClick={handleBuyNow}
              className="w-full h-[44px] rounded-xl bg-brand-ink text-white text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Buy it now
            </button>

            {/* Share */}
            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#ff8b87] transition-colors">
              <ShareIcon /> Share
            </button>

            {/* Shipping & Return info */}
            <div className="space-y-2.5 text-[13px] text-slate-500">
              <div className="flex items-start gap-2.5">
                <TruckIcon />
                <p>Estimated delivery: <strong className="text-brand-ink">12-28 days</strong> (International); <strong className="text-brand-ink">3-6 days</strong> (United States).</p>
              </div>
              <div className="flex items-start gap-2.5">
                <ReturnIcon />
                <p>Return within <strong className="text-brand-ink">45 days</strong> of purchase. Duties &amp; taxes are non-refundable.</p>
              </div>
            </div>

            {/* Payment badges */}
            <div className="border border-slate-100 rounded-2xl p-4 text-center">
              <p className="text-[12px] font-semibold text-brand-ink mb-3">Guarantee safe and secure checkout</p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <div className="px-2.5 py-1 text-[9px] font-extrabold text-white bg-blue-600 rounded tracking-wider">VISA</div>
                <div className="px-2.5 py-1 text-[9px] font-extrabold text-white bg-red-500 rounded tracking-wider">MC</div>
                <div className="px-2.5 py-1 text-[9px] font-extrabold text-white bg-blue-400 rounded tracking-wider">AMEX</div>
                <div className="px-2.5 py-1 text-[9px] font-extrabold text-[#003087] rounded italic">PayPal</div>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="border border-slate-200 rounded-2xl px-5 overflow-hidden">
              <Accordion title="Description">
                {product.description || (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 w-full bg-slate-50" />
                    <div className="h-3 w-5/6 bg-slate-50" />
                    <div className="h-3 w-4/6 bg-slate-50" />
                  </div>
                )}
              </Accordion>
              <Accordion title="Materials & Care">
                <p>Premium {selectedMaterial} fibers, safe and hypoallergenic. Spot clean with a damp cloth and mild soap. Air dry only.</p>
              </Accordion>
              <Accordion title="Free Shipping & Returns">
                <p>Free standard shipping on all orders over ₹499. Easy 30-day returns if you&apos;re not completely happy with your purchase.</p>
              </Accordion>
              <Accordion title="Reviews (12)">
                <p>Authentic reviews from our customers who love this product! 4.8 out of 5 stars based on 12 verified purchases.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommended Products ── */}
      <div className="page-shell pb-10 md:pb-28 pt-8 sm:pt-10">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-6">Recommended Products</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 hidden md:block bg-white border-t border-slate-200 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] transition-transform duration-400 ${stickyVisible && !stickyDismissed ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto max-w-[1400px] px-8 flex items-center h-[76px] gap-6">
          {/* Product thumb + name */}
          <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
            <img src={mainImage} alt="" className="w-11 h-11 object-contain rounded-xl border border-slate-100 p-1 bg-slate-50 flex-shrink-0 mix-blend-multiply" />
            <div className="min-w-0">
              <p className="font-bold text-[14px] text-brand-ink truncate font-display">{product.name}</p>
              <p className="text-[13px] text-slate-500">{formatCurrency(product.price)}</p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Variant selects */}
          <div className="hidden lg:flex items-end gap-6">
            {[
              { label: "Color",    value: selectedColor,    options: COLORS.map(c => c.name), onChange: setSelectedColor },
              { label: "Weight",   value: selectedWeight,   options: WEIGHTS,                 onChange: setSelectedWeight },
              { label: "Material", value: selectedMaterial, options: MATERIALS,               onChange: setSelectedMaterial },
            ].map(({ label, value, options, onChange }) => (
              <div key={label} className="flex flex-col gap-1 min-w-[110px]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink">{label}</span>
                <select
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-slate-700 bg-white outline-none focus:ring-1 focus:ring-brand-ink cursor-pointer"
                >
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 h-[42px] min-w-[140px] rounded-xl bg-[#ff8b87] text-white text-[14px] font-bold hover:bg-[#ff7777] transition-colors px-6 ml-4"
          >
            Add to cart
          </button>

          {/* Dismiss */}
          <button
            onClick={() => setStickyDismissed(true)}
            className="flex-shrink-0 text-slate-400 hover:text-brand-ink transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scroll‑to‑top FAB (coral circle) ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed right-8 z-50 w-14 h-14 rounded-full bg-[#ff8b87] text-white shadow-lg flex items-center justify-center hover:bg-[#ff7777] transition-all duration-300 ${scrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} ${stickyVisible && !stickyDismissed ? "bottom-24" : "bottom-8"}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </main>
  );
}
