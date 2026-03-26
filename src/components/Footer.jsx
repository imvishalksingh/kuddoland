import { Link } from 'react-router-dom';

export default function Footer({ storefront }) {
  if (!storefront) return null;

  return (
    <footer className="tt-footer">
      <div className="footer-newsletter">
        <div className="tt-container">
          <h3>Get Upto 20% Off</h3>
          <p>Subscribe to our newsletter for exclusive deals and new arrivals.</p>
          <form className="nl-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit" className="btn-coral">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-main">
        <div className="tt-container footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="site-logo">
              <span className="logo-kuddo">kuddo</span><span className="logo-land">land</span>
            </Link>
            <p>{storefront.footer?.blurb || "Curated toys made for joy & learning. Designed with love to spark everyday adventures."}</p>
            <div className="footer-socials">
              <a href="#">𝕏</a><a href="#">f</a><a href="#">𝑃</a><a href="#">📷</a>
            </div>
          </div>
          {storefront.footer?.columns?.map(col => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              {col.items.map(item => <Link key={item} to="/">{item}</Link>)}
            </div>
          ))}
          <div className="footer-col">
            <h4>Contact</h4>
            <p>📍 Kuddoland Towers, Sector 62, Noida, India</p>
            <p>📞 +91-98765-43210</p>
            <p>✉ info@kuddoland.com</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="tt-container">
          <p>© {new Date().getFullYear()} Kuddoland. All rights reserved.</p>
          <div className="pay-icons">💳 UPI &nbsp; 🏦 NEFT &nbsp; 💰 COD</div>
        </div>
      </div>
    </footer>
  );
}
