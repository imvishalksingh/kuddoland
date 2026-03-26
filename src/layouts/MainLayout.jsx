import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import ScrollToTop from "../components/utils/ScrollToTop";

const MARQUEE_ITEMS = [
  "🎁 40% OFF Store Wide — Use Code: KIDDO",
  "✨ Free Shipping on orders above ₹999",
  "🚀 New Arrivals added every week!",
  "🌟 Curated toys made for joy & learning",
  "🎉 Exclusive gifting collections now live",
];

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <ScrollToTop />
      
      {/* ── Top Bar ── */}
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

      {/* ── Marquee Bar ── */}
      <div className="marquee-bar" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      <Header />

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 bg-[#f5f5f5]">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <h3 className="font-body text-3xl font-semibold text-slate-900">Get In Touch With Us</h3>
            <div className="mt-4 flex max-w-sm gap-3">
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Enter your mail here" />
              <button className="rounded-lg bg-[#ff8f7d] px-4 py-3 text-sm font-semibold text-white">Subscribe</button>
            </div>
            <p className="mt-4 text-sm text-slate-500">No spam, just toys, collections, and special offers.</p>
          </div>
          <div>
            <h4 className="font-body text-lg font-semibold text-slate-900">Legal</h4>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>Faq</p>
              <p>Refund Policy</p>
              <p>Privacy Policy</p>
              <p>Cookies</p>
              <p>Terms of Use</p>
            </div>
          </div>
          <div>
            <h4 className="font-body text-lg font-semibold text-slate-900">Services</h4>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>Contact</p>
              <p>Careers</p>
              <p>24/7 Support</p>
              <p>News</p>
              <p>Delivery Info</p>
            </div>
          </div>
          <div>
            <h4 className="font-body text-lg font-semibold text-slate-900">Contact Us</h4>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>No 58 A, East Madison Street, Baltimore, MD, USA</p>
              <p>info@toytime.com</p>
              <p>000-123-456-7896</p>
            </div>
          </div>
        </div>
        <div className="page-shell border-t border-slate-200 py-5 text-xs text-slate-500">
          All Right Reserved Copyright 2024 Kuddosland
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}
