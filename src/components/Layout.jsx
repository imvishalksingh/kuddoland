import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import useDataStore from '../store/useDataStore';
import ScrollToTop from '../components/utils/ScrollToTop';

const MARQUEE_ITEMS = [
  "🎁 40% OFF Store Wide — Use Code: KIDDO",
  "✨ Free Shipping on orders above ₹999",
  "🚀 New Arrivals added every week!",
  "🌟 Curated toys made for joy & learning",
  "🎉 Exclusive gifting collections now live",
];

export default function Layout({ children }) {
  const { storefront, loading, error, fetchStorefront } = useDataStore();

  useEffect(() => {
    fetchStorefront();
  }, [fetchStorefront]);

  if (loading) {
    return (
      <main className="screen-state">
        <div className="screen-card">
          <div className="screen-logo">
            <span className="logo-kuddo">kuddo</span><span className="logo-land">land</span>
          </div>
          <h1>Loading Kuddoland…</h1>
          <p>Preparing your toy store.</p>
        </div>
      </main>
    );
  }

  if (error || !storefront) {
    return (
      <main className="screen-state">
        <div className="screen-card">
          <div className="screen-logo">
            <span className="logo-kuddo">kuddo</span><span className="logo-land">land</span>
          </div>
          <h1>Unavailable</h1>
          <p>{error || "Could not load storefront."}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <ScrollToTop />
      {/* ── Top Info Bar ── */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="tb-left">
            <span>✉ info@kuddoland.com</span>
            <span>📞 +91-98765-43210</span>
          </div>
          <div className="tb-center">40% OFF Store Wide — Use Code: <strong>KIDDO</strong></div>
          <div className="tb-right">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Pinterest">𝑃</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      {/* ── Marquee Ticker ── */}
      <div className="marquee-bar" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      <Header />
      
      <main id="top">
        {children}
      </main>

      <Footer storefront={storefront} />
      <CartDrawer storefront={storefront} />
    </>
  );
}
