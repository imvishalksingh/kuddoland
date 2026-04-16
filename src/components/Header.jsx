import { Link, useNavigate } from 'react-router-dom';
import useUIStore from '../store/useUIStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import useDataStore from '../store/useDataStore';
import { useState } from "react";
import { useCategories } from '../hooks/useCategories';
import { Search, Heart, ShoppingBag, User, Languages } from "lucide-react";

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
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const navigate = useNavigate();

  const allCategoryLinks = categories.map(c => ({
    label: c.name.toLowerCase() === "stem kit" ? "Star Baby" : c.name,
    url: `/shop?category=${c.slug}`
  }));

  const visibleNavLinks = [
    { label: "Home", url: "/" },
    ...allCategoryLinks.slice(0, 3)
  ];
  const dropdownNavLinks = allCategoryLinks.slice(3);

  const mobileNavLinks = [
    { label: "Home", url: "/" },
    ...allCategoryLinks,
    { label: "Full Shop", url: "/shop" }
  ];

  const handleMouseEnter = (name) => setActiveDropdown(name);
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-peach transition-all">
      <div
        className="mx-auto flex h-20 md:h-24 max-w-[1440px] items-center px-4 sm:px-8"
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Section: Mobile Toggle & Desktop Nav */}
        <div className="flex-[2] flex items-center justify-start gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2 text-brand-ink flex-shrink-0"
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

          {/* Mobile Search Icon */}
          <Link to="/search" className="hover:text-brand-coral transition-colors lg:hidden flex-shrink-0" aria-label="Search">
            <Search size={22} strokeWidth={1.5} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-6 font-body font-bold text-brand-ink text-[13px] uppercase tracking-wide h-full">
            {visibleNavLinks.map((link, idx) => (
              <Link key={idx} to={link.url} className={`${link.url === '/' ? 'text-brand-coral' : ''} hover:text-brand-coral transition-colors whitespace-nowrap`}>
                {link.label}
              </Link>
            ))}
            
            {/* Shop Now Dropdown */}
            <div 
              className="relative h-full flex items-center group cursor-pointer"
              onMouseEnter={() => handleMouseEnter('shop')}
              onMouseLeave={handleMouseLeave}
            >
              <Link to="/shop" className="hover:text-brand-coral flex items-center gap-1 transition-colors">
                SHOP NOW
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </Link>

              <div 
                className={`absolute top-full left-0 w-56 bg-white shadow-2xl rounded-2xl border border-slate-100 py-3 flex flex-col transition-all duration-200 origin-top-left ${activeDropdown === 'shop' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
              >
                {dropdownNavLinks.map((link, idx) => (
                  <Link 
                    key={idx} 
                    to={link.url} 
                    className="px-6 py-2.5 text-[12px] font-bold text-slate-600 hover:text-brand-coral hover:bg-slate-50 transition-all"
                    onClick={handleMouseLeave}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-slate-100 mx-4 my-2"></div>
                <Link 
                  to="/shop" 
                  className="px-6 py-2 text-[12px] font-black text-brand-coral hover:bg-brand-peach/30 transition-all uppercase tracking-widest"
                  onClick={handleMouseLeave}
                >
                  Explore All Toys
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Center Section: Logo */}
        <div className="flex-1 flex justify-center">
          <Link className="flex items-center transition-transform hover:scale-105" to="/">
            <img
              src="/kuddoslogo.png"
              alt="Kuddosland logo"
              className="h-10 w-auto max-w-[140px] sm:h-12 sm:max-w-44 lg:h-14 lg:max-w-56 object-contain"
            />
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex-[2] flex justify-end items-center gap-4 sm:gap-6 text-brand-ink">
          {/* Desktop Search Icon */}
          <Link to="/search" className="hover:text-brand-coral transition-colors hidden lg:block" aria-label="Search">
            <Search size={22} strokeWidth={1.5} />
          </Link>
          
          <div 
            onClick={() => user ? navigate('/account') : openAuthModal()}
            className="hover:text-brand-coral transition-colors flex items-center cursor-pointer" 
            aria-label="Account"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Me" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
            ) : (
              <User size={22} strokeWidth={1.5} />
            )}
          </div>

          <Link to="/account/wishlist" className="hover:text-brand-coral transition-colors flex items-center" aria-label="Wishlist">
            <Heart size={22} strokeWidth={1.5} />
          </Link>

          <div
            onClick={toggleCart}
            className="hover:text-brand-coral transition-colors relative cursor-pointer flex items-center"
            aria-label="Cart"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-coral text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm">{cartCount}</span>}
          </div>

          {/* Language Selector Dropdown */}
          <div
            className="hidden xl:flex items-center gap-1 cursor-pointer font-body text-sm font-bold opacity-80 hover:opacity-100 transition-opacity ml-2 relative group"
            onMouseEnter={() => handleMouseEnter('lang')}
            onMouseLeave={handleMouseLeave}
          >
            <Languages size={18} />
            <span className="ml-1">English</span>
            
            <div 
              className={`absolute top-full right-0 mt-2 w-32 bg-white shadow-2xl rounded-2xl border border-slate-100 p-2 flex flex-col transition-all duration-200 origin-top-right ${activeDropdown === 'lang' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            >
              <button className="px-4 py-2 text-xs font-bold text-left text-brand-coral bg-brand-peach/50 rounded-xl">English</button>
              <button className="px-4 py-2 text-xs font-bold text-left text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Spanish</button>
              <button className="px-4 py-2 text-xs font-bold text-left text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">French</button>
            </div>
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
            {mobileNavLinks.map((link, idx) => (
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
