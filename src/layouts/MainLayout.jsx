import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import ScrollToTop from "../components/utils/ScrollToTop";
import useDataStore from "../store/useDataStore";
import { useEffect } from "react";
import Footer from "../components/Footer";

export function MainLayout() {
  const { storefront, loading, fetchStorefront } = useDataStore();

  useEffect(() => {
    fetchStorefront();
  }, [fetchStorefront]);

  const email = storefront?.supportEmail || "support@kuddoland.com";
  const phone = storefront?.whatsappNumber || "+91-96905-60532";
  const messages = storefront?.topBarMessages || [
    "🎁 40% OFF Store Wide — Use Code: KUDDO40",
    "✨ First Order Discount — Use Code: KUDDOFIRST",
    "🚀 New Arrivals added every week!",
    "🌟 Curated toys made for joy & learning",
    "🎉 Exclusive gifting collections now live",
  ];
  const socials = storefront?.socialLinks || {};
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <ScrollToTop />

      {/* ── Top Bar ── */}
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

      <div className="marquee-bar" aria-hidden="true">
        <div className="marquee-track">
          {[...messages, ...messages, ...messages, ...messages, ...messages].map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
