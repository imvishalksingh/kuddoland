import { Link } from 'react-router-dom';
import useUIStore from '../store/useUIStore';
import { useCartStore } from '../store/cartStore';
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
          <nav className="hidden lg:flex items-center gap-8 font-body font-bold text-brand-ink text-sm uppercase tracking-wide">
            <Link to="/" className="text-brand-coral hover:text-brand-coral transition-colors">Home</Link>
            
            {/* Shop Mega Menu Trigger */}
            <div 
              className="h-24 flex items-center cursor-pointer hover:text-brand-coral transition-colors text-brand-coral"
              onMouseEnter={() => handleMouseEnter('shop')}
            >
              Shop +
            </div>

            <Link to="/blogs/news" className="hover:text-brand-coral transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-brand-coral transition-colors">Contact</Link>
            
            {/* Pages Dropdown Trigger */}
            <div 
              className="h-24 flex items-center cursor-pointer hover:text-brand-coral transition-colors"
              onMouseEnter={() => handleMouseEnter('pages')}
            >
              Pages +
            </div>
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

        {/* Mega Dropdown Panel for Shop */}
        <div 
          className={`absolute left-0 right-0 top-full mx-8 mt-2 rounded-[24px] bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-300 transform origin-top ${activeDropdown === 'shop' ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}
          onMouseEnter={() => handleMouseEnter('shop')}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex p-8 gap-12">
            {/* Dynamic categories grid */}
            <div className="flex-1 grid grid-cols-4 gap-x-8 gap-y-5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="font-body text-[15px] font-semibold text-brand-ink hover:text-brand-coral hover:translate-x-1 transition-all"
                  onClick={() => setActiveDropdown(null)}
                >
                  {cat.name}
                </Link>
              ))}
              {/* All products link */}
              <Link
                to="/shop"
                className="font-body text-[15px] font-bold text-brand-coral hover:underline"
                onClick={() => setActiveDropdown(null)}
              >
                View All →
              </Link>
            </div>
            
            {/* Banner Section */}
            <div className="w-[300px] shrink-0 rounded-[20px] bg-orange-50 overflow-hidden relative flex items-center justify-center border border-brand-peach">
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-start">
                <h3 className="font-display font-extrabold text-[42px] leading-none text-brand-coral drop-shadow-sm text-center">30 %</h3>
                <p className="text-center font-bold text-brand-ink text-xs tracking-[0.2em] mt-2">ON ALL KIDS TOYS</p>
                <div className="mt-auto pb-4">
                  <Link to="/shop" className="block text-center font-display text-sm font-bold text-brand-ink bg-white/60 backdrop-blur-sm rounded-full py-2 hover:bg-white transition-colors" onClick={() => setActiveDropdown(null)}>Shop Now</Link>
                </div>
              </div>
              <img src="/cat1.png" alt="Sale" className="absolute bottom-0 right-0 w-3/4 object-contain translate-x-4 translate-y-4 opacity-70 mix-blend-multiply" />
              <img src="/cat2.png" alt="Sale" className="absolute bottom-4 left-0 w-1/2 object-contain -translate-x-4 opacity-70 mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Pages Dropdown */}
        <div 
          className={`absolute left-[30%] top-full mt-2 w-48 rounded-[20px] bg-white shadow-xl ring-1 ring-black/5 p-4 flex flex-col gap-2 transition-all duration-200 transform origin-top ${activeDropdown === 'pages' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
          onMouseEnter={() => handleMouseEnter('pages')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/about" className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-brand-peach hover:text-brand-coral rounded-xl transition-colors">About Us</Link>
          <Link to="/faq" className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-brand-peach hover:text-brand-coral rounded-xl transition-colors">FAQ</Link>
          <Link to="/terms" className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-brand-peach hover:text-brand-coral rounded-xl transition-colors">Terms & Privacy</Link>
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
             <Link to="/" onClick={closeAll} className="py-3 border-b border-gray-100 text-brand-coral">Home</Link>
             <div className="py-3 border-b border-gray-100">
               <span className="text-gray-400 text-sm mb-2 block uppercase tracking-wider">Shop</span>
               <div className="flex flex-col pl-4 gap-2">
                 <Link to="/shop" onClick={closeAll} className="hover:text-brand-coral font-semibold">All Products</Link>
                 {categories.map((cat) => (
                   <Link
                     key={cat.id}
                     to={`/shop?category=${cat.slug}`}
                     onClick={closeAll}
                     className="hover:text-brand-coral font-normal text-sm"
                   >
                     {cat.name}
                   </Link>
                 ))}
               </div>
             </div>
             <Link to="/blogs/news" onClick={closeAll} className="py-3 border-b border-gray-100 hover:text-brand-coral">Blog</Link>
             <Link to="/contact" onClick={closeAll} className="py-3 border-b border-gray-100 hover:text-brand-coral">Contact</Link>
             <div className="py-3 border-b border-gray-100">
               <span className="text-gray-400 text-sm mb-2 block uppercase tracking-wider">Pages</span>
               <div className="flex flex-col pl-4 gap-2">
                 <Link to="/about" onClick={closeAll} className="hover:text-brand-coral font-normal text-sm">About Us</Link>
                 <Link to="/faq" onClick={closeAll} className="hover:text-brand-coral font-normal text-sm">FAQ</Link>
                 <Link to="/terms" onClick={closeAll} className="hover:text-brand-coral font-normal text-sm">Terms & Privacy</Link>
               </div>
             </div>
          </nav>
        </div>
      )}
    </header>
  );
}
