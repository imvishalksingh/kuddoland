import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useWishlist } from "../../hooks/useWishlist";

const PINK = "#F472B6";
const PINK_BG = "#FDF2F8";

const badgeMeta = {
  Bestseller: { bg: "#FEF3C7", color: "#92400E" },
  New:        { bg: "#DBEAFE", color: "#1E40AF" },
  Sale:       { bg: "#FCE7F3", color: "#9D174D" },
  Hot:        { bg: "#FEE2E2", color: "#991B1B" },
};

const emojiMap = { 
  1: "🧸", 2: "🚀", 3: "🦕", 4: "🪄", 5: "👨‍🍳", 6: "🏰" 
};

function HeartIcon({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill={filled ? PINK : "none"}
      stroke={filled ? PINK : PINK}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke={PINK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function BagIcon({ added }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke={added ? "#22C55E" : PINK}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(0);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const liked = isWishlisted(product.id);
  const tag = product.featured ? "Bestseller" : (product.price > 699 ? "Hot" : "New");
  const colors = product.colors || ["#F4C430", "#F4A7B9", "#E05C5C", "#A8D5BA"];
  const image = product.images?.[0] || product.image;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (added) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/shop/${product.slug}`)}
      className="relative w-full flex-shrink-0 cursor-pointer overflow-hidden bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        borderRadius: "20px",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)"
          : "0 2px 10px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      {/* Image area */}
      <div className="relative w-full pt-[100%] bg-[#F5F5F5] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[400ms] ease-out"
              style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
            />
          ) : (
            <div 
              className="text-[64px] transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] opacity-[0.85] select-none"
              style={{ transform: hovered ? "scale(1.1) translateY(-4px)" : "scale(1)" }}
            >
              {emojiMap[parseInt(product.id.toString().slice(-1)) % 6 + 1] || "🧸"}
            </div>
          )}
        </div>

        {/* Badge */}
        {tag && (
          <div 
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider z-[2]"
            style={{ 
              background: badgeMeta[tag]?.bg || "#F3F4F6", 
              color: badgeMeta[tag]?.color || "#374151",
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {tag}
          </div>
        )}

        {/* Action buttons — right side */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-[3]">
          {[
            {
              key: "wish",
              icon: <HeartIcon filled={liked} />,
              onClick: (e) => { e.stopPropagation(); toggleWishlist(product.id); },
              alwaysShow: liked,
              bgOverride: liked ? PINK_BG : null,
            },
            {
              key: "eye",
              icon: <EyeIcon />,
              onClick: (e) => e.stopPropagation(),
              alwaysShow: false,
            },
          ].map((btn, i) => (
            <button
              key={btn.key}
              onClick={btn.onClick}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-[#F0F0F0] backdrop-blur-sm shadow-md transition-all duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:w-9 sm:h-9"
              style={{
                background: btn.bgOverride || "rgba(255,255,255,0.95)",
                opacity: hovered || btn.alwaysShow ? 1 : 0,
                transform: hovered || btn.alwaysShow
                  ? "translateX(0) scale(1)"
                  : "translateX(10px) scale(0.8)",
                transitionDelay: `${i * 45}ms`,
                pointerEvents: hovered || btn.alwaysShow ? "auto" : "none",
              }}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-3 right-3 py-2.5 text-white text-[11px] font-bold rounded-[14px] shadow-lg transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-[10] flex items-center justify-center gap-2"
          style={{ 
            fontFamily: "'DM Sans', sans-serif",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(12px)",
            backgroundColor: added ? "#22C55E" : "#111827",
            pointerEvents: hovered ? "auto" : "none"
          }}
        >
          {added ? (
            <>
              <CheckIcon />
              <span>Added!</span>
            </>
          ) : (
            <>
              <BagIcon added={false} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Card body */}
      <div className="p-3 pb-3.5">
        <p className="text-[13px] font-bold text-[#111827] mb-0.5 leading-tight line-clamp-1 sm:text-[14px]" style={{ fontFamily: "'Sora', sans-serif" }}>
          {product.name}
        </p>

        <p className="text-[14px] font-extrabold text-[#111827] mb-2.5 sm:text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>
          ₹{product.price.toFixed(2)}
        </p>

        {/* Swatches */}
        <div className="flex items-center gap-1.5">
          {colors.slice(0, 3).map((c, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setSelectedColor(i); }}
              className="rounded-full shrink-0 transition-all duration-[200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: i === selectedColor ? "14px" : "10px",
                height: i === selectedColor ? "14px" : "10px",
                background: c,
                outline: i === selectedColor ? `2px solid ${c}` : "2px solid transparent",
                outlineOffset: "1.5px",
                boxShadow: i === selectedColor ? `0 2px 7px ${c}90` : "none",
              }}
            />
          ))}
          {colors.length > 3 && (
            <span className="text-[9px] font-bold text-[#9CA3AF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              +{colors.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
