import { Link } from 'react-router-dom';
import useUIStore from '../store/useUIStore';
import { useCartStore } from '../store/cartStore';
import useDataStore from '../store/useDataStore';
import { useState } from "react";
import { useCategories } from '../hooks/useCategories';

export default function Header() {
  const cartOpen = useUIStore((state) => state.cartOpen);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const menuOpen = useUIStore((state) => state.menuOpen);
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  const closeAll = useUIStore((state) => state.closeAll);

  const items = useCartStore((state) => state.items);
  const cartCount = items?.length || 0;
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { data: categories = [] } = useCategories();
  const { storefront } = useDataStore();

  const dynamicNavLinks = [
    { label: "Home", url: "/" },
    ...categories.slice(0, 5).map(c => ({
      label: c.name.toLowerCase() === "stem kit" ? "Star Baby" : c.name,
      url: `/shop?category=${c.slug}`
    })),
    { label: "Shop Now", url: "/shop" },
  ];

  const handleMouseEnter = (name) => setActiveDropdown(name);
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-peach transition-all">
      <div
        className="mx-auto flex h-20 md:h-24 max-w-[1400px] items-center justify-between px-4 sm:px-8 relative"
        onMouseLeave={handleMouseLeave}
      >

        {/* Left Section (Mobile Menu Toggle & Desktop Nav) */}
        <div className="flex-1 flex items-center justify-start">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2 text-brand-ink"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body font-bold text-brand-ink text-[13px] uppercase tracking-wide">
            {dynamicNavLinks.map((link, idx) => (
              <Link key={idx} to={link.url} className={`${link.url === '/' ? 'text-brand-coral' : ''} hover:text-brand-coral transition-colors whitespace-nowrap`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Logo */}
        <div className="flex-shrink-0 absolute left-1/2 -translate-x-1/2">
          <Link className="flex items-center" to="/">
            <img
              src="/kuddoslogo.png"
              alt="Kuddosland logo"
              className="h-10 w-auto max-w-[160px] object-contain sm:h-12 sm:max-w-[180px] lg:h-14 lg:max-w-[220px]"
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end items-center gap-4 sm:gap-5 text-brand-ink">
          <Link to="/search" className="hover:text-brand-coral transition-colors" aria-label="Search">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </Link>
          <Link to="/account/wishlist" className="hover:text-brand-coral transition-colors hidden sm:block" aria-label="Wishlist">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </Link>
          <div
            onClick={toggleCart}
            className="hover:text-brand-coral transition-colors relative cursor-pointer"
            aria-label="Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-brand-coral text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
          </div>
          <Link to="/account" className="hover:text-brand-coral transition-colors hidden sm:block mr-2" aria-label="Account">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </Link>

          <div
            className="hidden lg:flex items-center gap-1 cursor-pointer font-body text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
            onMouseEnter={() => handleMouseEnter('lang')}
          >
            English
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Language Dropdown */}
        <div
          className={`absolute right-[2%] top-full mt-2 w-32 rounded-[20px] bg-white shadow-xl ring-1 ring-black/5 p-2 flex flex-col gap-1 transition-all duration-200 transform origin-top ${activeDropdown === 'lang' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
          onMouseEnter={() => handleMouseEnter('lang')}
          onMouseLeave={handleMouseLeave}
        >
          <button className="px-4 py-2 text-sm font-bold text-left text-brand-coral bg-brand-peach rounded-xl">English</button>
          <button className="px-4 py-2 text-sm font-bold text-left text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Spanish</button>
          <button className="px-4 py-2 text-sm font-bold text-left text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">French</button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-brand-peach overflow-y-auto max-h-[80vh]">
          <nav className="flex flex-col py-4 px-6 font-body font-semibold text-brand-ink">
            {dynamicNavLinks.map((link, idx) => (
              <Link key={idx} to={link.url} onClick={closeAll} className="py-3 border-b border-gray-100 hover:text-brand-coral">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
