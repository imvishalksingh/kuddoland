import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import useDataStore from '../store/useDataStore';
import ScrollToTop from '../components/utils/ScrollToTop';

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

  const email = storefront?.supportEmail || "support@kuddoland.com";
  const phone = storefront?.whatsappNumber || "+91-96905-60532";
  const messages = storefront?.topBarMessages || [
    "🎁 40% OFF Store Wide — Use Code: KUDDO40",
    "✨ First Order Discount — Use Code: KUDDOFIRST",
    "🚀 New Arrivals added every week!",
  ];
  const socials = storefront?.socialLinks || {};

  return (
    <>
      <ScrollToTop />
      {/* ── Top Info Bar ── */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="tb-left">
            <span>✉ {email}</span>
            <span>📞 {phone}</span>
          </div>
          <div className="tb-center">
            {messages[0]}
          </div>
          <div className="tb-right">
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">𝕏</a>}
            {socials.facebook && <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">f</a>}
            {socials.pinterest && <a href={socials.pinterest} target="_blank" rel="noreferrer" aria-label="Pinterest">𝑃</a>}
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">📷</a>}
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>}
          </div>
        </div>
      </div>

      {/* ── Marquee Ticker ── */}
      <div className="marquee-bar" aria-hidden="true">
        <div className="marquee-track">
          {[...messages, ...messages, ...messages, ...messages, ...messages].map((text, i) => (
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
