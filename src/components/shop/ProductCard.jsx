import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useWishlist } from "../../hooks/useWishlist";
import useUIStore from "../../store/useUIStore";
import "../../styles/kuddo-shop.css";

const tagStyles = {
  Bestseller: { bg: "#FFF8E1", color: "#F59E0B" },
  New:        { bg: "#EFF6FF", color: "#3B82F6" },
  Hot:        { bg: "#FFF1F0", color: "#F43F5E" },
  Sale:       { bg: "#F0FDF4", color: "#22C55E" },
  "Top Rated":{ bg: "#F5F3FF", color: "#8B5CF6" },
};

function Stars({ rating }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="10" height="10" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#FBBF24" : "#E5E7EB"}
          stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24"
      fill={filled ? "#F43F5E" : "none"}
      stroke={filled ? "#F43F5E" : "#6B7280"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const [selectedColor, setSelectedColor] = useState(0);
  const [cartState, setCartState] = useState("idle");
  const [hovered, setHovered] = useState(false);

  const liked = isWishlisted(product.id);
  const originalPrice = product.comparePrice || product.originalPrice || product.price * 1.25;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const tag = product.tag || (product.featured ? "Bestseller" : (product.price > 699 ? "Hot" : "New"));
  const colors = product.colors || ["#E8C547", "#F4A7B9", "#B39DDB", "#80CBC4"];
  const image = product.images?.[0] || product.image;

  const handleCart = (e) => {
    e.stopPropagation();
    if (cartState !== "idle") return;
    setCartState("adding");
    addItem(product, 1);
    setCartOpen(true);
    setTimeout(() => setCartState("done"), 600);
    setTimeout(() => setCartState("idle"), 2000);
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/shop/${product.slug}`)}
    >
      {/* ── Image Block ── */}
      <div className="img-block">
        {image ? (
          <img src={image} alt={product.name} />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "48px",
          }}>
            🧸
          </div>
        )}

        {/* Tag Badge */}
        {tag && (
          <div className="product-tag" style={{
            background: tagStyles[tag]?.bg || "#F9FAFB",
            color: tagStyles[tag]?.color || "#6B7280",
          }}>
            {tag}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="wishlist-btn"
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          style={{
            opacity: hovered || liked ? 1 : 0,
            transform: hovered || liked ? "scale(1)" : "scale(0.8)",
            pointerEvents: hovered || liked ? "auto" : "none",
          }}
        >
          <HeartIcon filled={liked} />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="discount-badge">
            -{discount}%
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="card-body">
        <div className="product-name">{product.name}</div>
        <div className="product-subtitle">{product.brand || product.category || "Premium Quality"}</div>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
          <Stars rating={product.rating || 5} />
          <span style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
            {product.rating || "5.0"}
          </span>
        </div>

        {/* Price */}
        <div className="price-row">
          <span className="price-current">₹{product.price}</span>
          {originalPrice > product.price && (
            <span className="price-old">₹{Math.round(originalPrice)}</span>
          )}
        </div>

        {/* Color Swatches */}
        <div className="swatches">
          {colors.slice(0, 3).map((c, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setSelectedColor(i); }}
              style={{
                width: i === selectedColor ? "16px" : "12px",
                height: i === selectedColor ? "16px" : "12px",
                borderRadius: "50%",
                background: c,
                border: "none",
                outline: i === selectedColor ? `2px solid ${c}` : "2px solid transparent",
                outlineOffset: "1.5px",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.15s ease",
                flexShrink: 0,
              }}
            />
          ))}
          {colors.length > 3 && (
            <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 700 }}>+{colors.length - 3}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          className="btn-add"
          onClick={handleCart}
          style={{
            background: cartState === "done" ? "#22C55E" : "#111827",
            boxShadow: cartState === "done"
              ? "0 4px 14px rgba(34,197,94,0.3)"
              : hovered ? "0 4px 14px rgba(17,24,39,0.2)" : "none",
          }}
        >
          {cartState === "done" ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Added!
            </>
          ) : (
            <>{cartState === "adding" ? "Adding…" : <><CartIcon /> Add to Cart</>}</>
          )}
        </button>
      </div>
    </div>
  );
}
