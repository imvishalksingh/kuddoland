import { useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CATEGORY_CONTENT } from "../data/categoryContent";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { ProductCard } from "../components/shop/ProductCard";
import { Seo } from "../components/ui/Seo";
import { CategorySeoContent } from "../components/ui/CategorySeoContent";
import { clsx } from "clsx";
import "../styles/kuddo-shop.css";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams();
  const [sort, setSort] = useState("featured");

  const initialCategory = categorySlug || searchParams.get("category") || "All";
  const initialAge = searchParams.get("age") || "All";

  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategory);
  const [selectedAge, setSelectedAge] = useState(initialAge);

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: categories = [], isLoading: isLoadingCats } = useCategories();

  useEffect(() => {
    setSelectedCategorySlug(categorySlug || searchParams.get("category") || "All");
    setSelectedAge(searchParams.get("age") || "All");
  }, [categorySlug, searchParams]);

  const bestSeller = useMemo(() => products.find(p => p.isFeatured) || products[0], [products]);

  const ageGroups = ["All", "0-1 year", "2-4 years", "5-8 years", "9-12 years"];

  const slugify = (text) => text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (selectedCategorySlug !== "All") {
      items = items.filter(item => {
        const itemCategoryName = item.category || "Toys";
        const matchingCat = categories.find(c => c.slug === selectedCategorySlug);
        if (matchingCat) {
          return itemCategoryName.toLowerCase() === matchingCat.name.toLowerCase();
        }
        return slugify(itemCategoryName) === selectedCategorySlug || itemCategoryName.toLowerCase() === selectedCategorySlug.toLowerCase();
      });
    }

    if (selectedAge !== "All") {
      items = items.filter(item => {
        const itemAge = (item.ageGroup || "").replace(/\s/g, "").toLowerCase();
        const searchAge = selectedAge.toLowerCase().replace(/\s/g, "");
        if (searchAge.includes("0-1")) return itemAge.includes("0-2");
        if (searchAge.includes("2-4")) return itemAge.includes("3-5") || itemAge.includes("0-2");
        if (searchAge.includes("5-8")) return itemAge.includes("6-8");
        if (searchAge.includes("9-12")) return itemAge.includes("9-12");
        return itemAge.includes(searchAge) || searchAge.includes(itemAge);
      });
    }

    if (sort === "price_asc") return items.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") return items.sort((a, b) => b.price - a.price);
    return items.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }, [products, categories, sort, selectedCategorySlug, selectedAge]);

  const handleCategoryChange = (slug) => {
    setSelectedCategorySlug(slug);
    setSearchParams(prev => {
      if (slug === "All") prev.delete("category");
      else prev.set("category", slug);
      return prev;
    });
  };

  const handleAgeChange = (age) => {
    setSelectedAge(age);
    setSearchParams(prev => {
      if (age === "All") prev.delete("age");
      else prev.set("age", age);
      return prev;
    });
  };

  const seoId = useMemo(() => {
    if (selectedCategorySlug !== "All" && CATEGORY_CONTENT[selectedCategorySlug]) {
      return selectedCategorySlug;
    }
    if (selectedAge !== "All") {
      if (selectedAge.includes("0-1")) return "0-1-year-kids-toy";
      if (selectedAge.includes("2-4")) return "2-4-year-kids-toy";
      if (selectedAge.includes("5-8")) return "5-8-year-kids-toy";
      if (selectedAge.includes("9-12")) return "9-12-year-kids-toy";
    }
    return null;
  }, [selectedCategorySlug, selectedAge]);

  const activeCategoryName = useMemo(() => {
    if (selectedCategorySlug === "All") {
      if (selectedAge !== "All") return `${selectedAge} Toys`;
      return "All Toys";
    }
    const cat = categories.find(c => c.slug === selectedCategorySlug);
    if (cat) return cat.name;
    const richContent = CATEGORY_CONTENT[seoId];
    if (richContent) return richContent.heading.split('|')[0].trim();
    return selectedCategorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [selectedCategorySlug, selectedAge, categories, seoId]);

  const richContent = CATEGORY_CONTENT[seoId];

  return (
    <div className="min-h-screen kuddo-shop" style={{ background: "#FFFBF7" }}>
      <Seo
        title={richContent?.metaTitle || `${activeCategoryName} | Kuddosland`}
        description={richContent?.metaDescription || "Browse our curated collection of high-quality toys and educational kits."}
      />

      {/* ── Page Header ── */}
      <section style={{
        background: "linear-gradient(135deg, #fff9f0 0%, #fff5e8 100%)",
        padding: "32px 16px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
          <Link to="/" style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "#94a3b8", fontSize: "11px" }}>/</span>
          <Link to="/shop" style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>Shop</Link>
          {selectedCategorySlug !== "All" && (
            <>
              <span style={{ color: "#94a3b8", fontSize: "11px" }}>/</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#0f1f3d", textTransform: "uppercase", letterSpacing: "0.05em" }}>{activeCategoryName}</span>
            </>
          )}
        </nav>

        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(20px, 5vw, 40px)", fontWeight: 800, color: "#0f1f3d", lineHeight: 1.1, margin: "0 0 10px" }}>
          {activeCategoryName}
        </h1>
        <p style={{ fontSize: "clamp(13px, 3vw, 16px)", color: "#64748b", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
          Discover a world of joy and imagination. Find the perfect toy for every milestone.
        </p>
      </section>

      {/* ── Mobile Filter Bar (hidden on desktop) ── */}
      <div className="mobile-filter-bar lg:hidden">
        {/* Category Pills */}
        <div className="mobile-filter-section">
          {[{ name: "All Toys", slug: "All" }, ...categories].map((cat) => {
            const slug = cat.slug || "All";
            const name = cat.name || "All Toys";
            const isActive = selectedCategorySlug === slug;
            return (
              <button
                key={slug}
                onClick={() => handleCategoryChange(slug)}
                className={clsx("filter-pill", isActive && "active")}
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="mobile-filter-divider" />

        {/* Age + Sort Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 16px 10px" }}>
          <div className="mobile-age-section" style={{ padding: 0, flex: 1 }}>
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => handleAgeChange(age)}
                className={clsx("age-pill", selectedAge === age && "active")}
              >
                {age === "All" ? "All Ages" : age}
              </button>
            ))}
          </div>

          <select
            style={{
              flexShrink: 0,
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "10px",
              padding: "6px 10px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#374151",
              fontFamily: "'Inter', sans-serif",
              appearance: "none",
              WebkitAppearance: "none",
              cursor: "pointer",
              outline: "none",
            }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Sort</option>
            <option value="price_asc">₹ Low</option>
            <option value="price_desc">₹ High</option>
          </select>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="shop-wrapper" style={{ paddingTop: "24px", paddingBottom: "60px" }}>
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>

          {/* ── Desktop Sidebar (hidden on mobile) ── */}
          <aside
            className="hidden lg:block"
            style={{ width: "220px", flexShrink: 0, position: "sticky", top: "100px" }}
          >
            {/* Categories */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "16px", fontWeight: 800, color: "#0f1f3d", marginBottom: "12px" }}>
                Categories
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {[{ name: "All Toys", slug: "All" }, ...categories].map((cat) => {
                  const slug = cat.slug || "All";
                  const name = cat.name || "All Toys";
                  const isActive = selectedCategorySlug === slug;
                  return (
                    <button
                      key={slug}
                      onClick={() => handleCategoryChange(slug)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 14px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        cursor: "pointer",
                        border: "none",
                        background: isActive ? "#ff5722" : "transparent",
                        color: isActive ? "#fff" : "#64748b",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age Groups */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "16px", fontWeight: 800, color: "#0f1f3d", marginBottom: "12px" }}>
                Age Groups
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {ageGroups.map((age) => {
                  const isActive = selectedAge === age;
                  return (
                    <button
                      key={age}
                      onClick={() => handleAgeChange(age)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        cursor: "pointer",
                        border: isActive ? "2px solid #0f1f3d" : "2px solid #e5e7eb",
                        background: isActive ? "#0f1f3d" : "#fff",
                        color: isActive ? "#fff" : "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {age === "All" ? "All Ages" : age}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Today's Pick */}
            {bestSeller && (
              <div style={{ background: "#fff", borderRadius: "20px", border: "1.5px solid #f0f0f0", padding: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#f59e0b", marginBottom: "10px" }}>Today's Pick</p>
                <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "10px", aspectRatio: "1", background: "#f5f5f5" }}>
                  <img src={bestSeller.images?.[0] || bestSeller.image} alt={bestSeller.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f1f3d", marginBottom: "4px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{bestSeller.name}</p>
                <p style={{ fontSize: "13px", fontWeight: 800, color: "#ff5722", marginBottom: "12px" }}>{formatCurrency(bestSeller.price)}</p>
                <Link to={`/shop/${bestSeller.slug}`} style={{ display: "block", textAlign: "center", padding: "10px", background: "#0f1f3d", color: "#fff", borderRadius: "10px", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}>
                  View Detail
                </Link>
              </div>
            )}
          </aside>

          {/* ── Product Area ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Desktop Toolbar */}
            <div className="hidden lg:flex" style={{ alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Showing</span>
                <span style={{ fontSize: "22px", fontWeight: 800, color: "#0f1f3d", fontFamily: "'Sora', sans-serif" }}>{filteredProducts.length}</span>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>exclusive toys</span>
              </div>
              <select
                style={{
                  background: "#fff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "9px 16px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#374151",
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  outline: "none",
                }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* ── Product Grid ── */}
            <div className="shop-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ── Empty State ── */}
            {filteredProducts.length === 0 && !isLoadingProducts && (
              <div style={{ minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: "20px", border: "2px dashed #e5e7eb", marginTop: "16px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧸</div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 700, color: "#0f1f3d", marginBottom: "6px" }}>No Toys Found</h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px", maxWidth: "240px" }}>Try adjusting your filters to find what you're looking for!</p>
                <button
                  onClick={() => { setSelectedCategorySlug("All"); setSelectedAge("All"); setSearchParams({}); }}
                  style={{ padding: "10px 24px", background: "#ff5722", color: "#fff", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* ── Pagination ── */}
            {filteredProducts.length > 0 && (
              <div style={{ paddingTop: "32px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                <button style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", fontSize: "16px" }}>←</button>
                <button style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#0f1f3d", color: "#fff", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer" }}>1</button>
                <button style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "#fff", fontWeight: 700, fontSize: "13px", color: "#64748b", cursor: "pointer" }}>2</button>
                <button style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", fontSize: "16px" }}>→</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SEO Content ── */}
      <CategorySeoContent categorySlug={seoId} />
    </div>
  );
}
