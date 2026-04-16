import { useMemo, useState, useEffect, useRef } from "react";
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
        className="w-full flex items-center justify-between py-4 bg-white text-left text-base font-semibold text-slate-900 hover:text-[#ff8b87] transition-colors"
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
        <div className="pb-4 text-sm leading-relaxed text-slate-500">{children}</div>
      )}
    </div>
  );
};


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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [stickyVisible, setStickyVisible] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const galleryRef = useRef(null);

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

  const gallery = useMemo(() => {
    if (!product) return [];
    return product.images?.length ? product.images : [product.image].filter(Boolean);
  }, [product]);

  const related = useMemo(
    () => products.filter((p) => p.id !== product?.id).slice(0, 4),
    [product?.id, products]
  );

  useEffect(() => {
    // Reset selections when product changes
    if (product) {
      setSelectedImage("");
      setSelectedColor(product.colors?.[0]?.name || "");
      setSelectedWeight(product.weights?.[0] || "");
      setSelectedMaterial(product.materials?.[0] || "");
    }
  }, [product?.id, product]);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      if (gallery[index] && gallery[index] !== selectedImage) {
        setSelectedImage(gallery[index]);
      }
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [gallery, selectedImage]);

  // If we have literally nothing (no cache, no mock), show a full-page pulse
  if (!product && isLoading) {
    return (
      <div className="page-shell py-10 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="h-96 bg-slate-100 rounded-2xl" />
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
            {/* Main image scrollable container */}
            <div 
              ref={galleryRef}
              className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl bg-slate-50 gap-0"
            >
              {gallery.map((img, i) => (
                <div key={`${img}-${i}`} className="min-w-full snap-center flex items-center justify-center min-h-[320px] sm:min-h-[480px] p-6">
                  <img
                    src={img}
                    alt={`${product.name} vision ${i}`}
                    className="max-h-[320px] sm:max-h-[480px] w-full object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>

            {/* Indicator dots for mobile scroll */}
            <div className="flex justify-center gap-1.5 lg:hidden px-2">
              {gallery.map((_, i) => {
                 const isActive = selectedImage === gallery[i] || (!selectedImage && i === 0);
                 return (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? "w-6 bg-slate-900" : "w-1.5 bg-slate-200"}`} />
                 );
              })}
            </div>

            {/* Horizontal thumbnails */}
            <div className="flex flex-row gap-3 overflow-x-auto pb-2 scroll-smooth px-1">
              {gallery.map((img, i) => (
                <button
                  key={`${img}-${i}-thumb`}
                  onClick={() => {
                    setSelectedImage(img);
                    galleryRef.current?.scrollTo({
                      left: galleryRef.current.offsetWidth * i,
                      behavior: "smooth"
                    });
                  }}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 p-1 transition-all ${ (selectedImage === img || (!selectedImage && i === 0)) ? "border-slate-700 bg-white" : "border-slate-100 hover:border-slate-300 bg-slate-50"}`}
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
              <h1 className="text-2xl font-bold text-slate-900 font-display mb-2">{product.name}</h1>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                {product.description || "A wonderful addition to your collection..."}
              </p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex text-amber-400">
                  <span className="text-sm">★★★★★</span>
                </div>
                <span className="text-slate-400 text-xs">(4.8 / 5.0)</span>
              </div>
              
              <div className="mt-4 text-2xl font-bold text-slate-900">
                {formatCurrency(product.price)}
              </div>
            </div>

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm font-bold text-slate-900 mb-2">
                  Color: <span className="font-normal text-slate-500">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-md border-2 transition-all ${selectedColor === c.name ? "ring-2 ring-slate-900 ring-offset-2 border-transparent" : "border-slate-200"}`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Weight */}
            {product.weights && product.weights.length > 0 && (
              <div>
                <p className="text-sm font-bold text-slate-900 mb-2">
                  Weight: <span className="font-normal text-slate-500">{selectedWeight}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.weights.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedWeight === w ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material */}
            {product.materials && product.materials.length > 0 && (
              <div>
                <p className="text-sm font-bold text-slate-900 mb-2">
                  Material: <span className="font-normal text-slate-500">{selectedMaterial}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(m)}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedMaterial === m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart + Wishlist + Compare — all in ONE row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Qty stepper */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-10 text-sm font-bold flex-shrink-0">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 h-full text-slate-400 hover:bg-slate-50 transition-colors select-none">−</button>
                <span className="px-4 text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-4 h-full text-slate-400 hover:bg-slate-50 transition-colors select-none">+</button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-0 h-10 rounded-xl bg-[#ff8b87] text-white text-sm font-bold hover:bg-[#ff7777] transition-colors"
              >
                Add to cart
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isWishlisted(product.id) ? "bg-[#ff8b87] border-[#ff8b87] text-white" : "border-slate-200 text-slate-500 hover:border-slate-400 bg-white"}`}
                aria-label="Wishlist"
              >
                <HeartIcon filled={isWishlisted(product.id)} />
              </button>

              {/* Compare */}
              <button
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 bg-white transition-all"
                aria-label="Compare"
              >
                <CompareIcon />
              </button>
            </div>

            {/* Buy it now */}
            <button
              onClick={handleBuyNow}
              className="w-full h-10 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Buy it now
            </button>

            {/* Share */}
            <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#ff8b87] transition-colors">
              <ShareIcon /> Share
            </button>

            {/* Shipping & Return info */}
            <div className="space-y-2.5 text-sm text-slate-500">
              <div className="flex items-start gap-2.5">
                <TruckIcon />
                <p>Estimated delivery: <strong className="text-slate-900">12-28 days</strong> (International); <strong className="text-slate-900">3-6 days</strong> (United States).</p>
              </div>
              <div className="flex items-start gap-2.5">
                <ReturnIcon />
                <p>Return within <strong className="text-slate-900">45 days</strong> of purchase. Duties &amp; taxes are non-refundable.</p>
              </div>
            </div>

            {/* Payment badges */}
            <div className="border border-slate-100 rounded-2xl p-4 text-center">
              <p className="text-xs font-semibold text-slate-900 mb-3">Guarantee safe and secure checkout</p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <div className="px-2.5 py-1 text-xs font-extrabold text-white bg-blue-600 rounded tracking-wider">VISA</div>
                <div className="px-2.5 py-1 text-xs font-extrabold text-white bg-red-500 rounded tracking-wider">MC</div>
                <div className="px-2.5 py-1 text-xs font-extrabold text-white bg-blue-400 rounded tracking-wider">AMEX</div>
                <div className="px-2.5 py-1 text-xs font-extrabold text-[#003087] rounded italic">PayPal</div>
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
                {product.materialsAndCare ? <p className="whitespace-pre-line leading-relaxed">{product.materialsAndCare}</p> : <p>Premium safe fibers. Spot clean with a damp cloth and mild soap. Air dry only.</p>}
              </Accordion>
              <Accordion title="Shipping & Returns">
                {product.shippingAndReturns ? <p className="whitespace-pre-line leading-relaxed">{product.shippingAndReturns}</p> : <p>Free standard shipping on all orders over ₹499. Easy 30-day returns if you're not completely happy with your purchase.</p>}
              </Accordion>
              <Accordion title={`Reviews (${product.reviews?.length || 0})`}>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.filter(r => r.isApproved).map(r => (
                      <div key={r.id} className="border-b border-dashed border-slate-100 pb-3 last:border-0 last:pb-0">
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-amber-400 text-xs">{"★".repeat(r.rating || 5)}</span>
                           <span className="font-semibold text-slate-800">{r.title}</span>
                         </div>
                         <p className="text-slate-600 text-sm leading-relaxed">{r.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No verified reviews yet for this product. Be the first to purchase and review!</p>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommended Products ── */}
      <div className="page-shell pb-10 md:pb-28 pt-8 sm:pt-10">
        <h2 className="font-display text-xl font-bold text-slate-900 mb-6">Recommended Products</h2>
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
        <div className="mx-auto max-w-[1400px] px-8 flex items-center h-20 gap-6">
          {/* Product thumb + name */}
          <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
            <img src={mainImage} alt="" className="w-11 h-11 object-contain rounded-xl border border-slate-100 p-1 bg-slate-50 flex-shrink-0 mix-blend-multiply" />
            <div className="min-w-0">
              <p className="font-bold text-sm text-slate-900 truncate font-display">{product.name}</p>
              <p className="text-sm text-slate-500">{formatCurrency(product.price)}</p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Variant selects */}
          <div className="hidden lg:flex items-end gap-6">
            {[
              ...(product.colors?.length ? [{ label: "Color", value: selectedColor, options: product.colors.map(c => c.name), onChange: setSelectedColor }] : []),
              ...(product.weights?.length ? [{ label: "Weight", value: selectedWeight, options: product.weights, onChange: setSelectedWeight }] : []),
              ...(product.materials?.length ? [{ label: "Material", value: selectedMaterial, options: product.materials, onChange: setSelectedMaterial }] : []),
            ].map(({ label, value, options, onChange }) => (
              <div key={label} className="flex flex-col gap-1 min-w-28">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">{label}</span>
                <select
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                >
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 h-10 min-w-36 rounded-xl bg-[#ff8b87] text-white text-sm font-bold hover:bg-[#ff7777] transition-colors px-6 ml-4"
          >
            Add to cart
          </button>

          {/* Dismiss */}
          <button
            onClick={() => setStickyDismissed(true)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-900 transition-colors"
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
