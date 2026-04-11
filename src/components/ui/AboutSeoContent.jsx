import { Link } from 'react-router-dom';
import { 
  Baby, BookOpen, ShieldCheck, Truck, Award, CreditCard, 
  Gift, Smile, Brain, Shield, IndianRupee, Rocket, Heart, 
  Check, ShoppingBag, Users, ArrowRight 
} from 'lucide-react';
import '../../styles/kuddo-seo.css';

export function AboutSeoContent() {
  return (
    <div className="kuddo-seo">
      
      {/* HERO / ABOUT KUDDOLAND */}
      <div className="hero">
        <h1><Baby className="inline-icon" /> About Kuddoland</h1>
        <p>At <strong>Kuddoland</strong>, we believe that childhood should be filled with joy, creativity, and endless moments of discovery. We are more than just a toy brand—we are a small step towards making every child’s playtime meaningful, safe, and full of learning.</p>
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'Nunito', fontWeight: 800, marginBottom: '8px' }}><BookOpen className="inline-icon" /> Our Story</h2>
          <p style={{ fontSize: '14px', maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.85)' }}>
            Kuddoland started with a simple idea: bringing smiles to kids while making parents feel confident about what they buy. We noticed that many toys in the market were either too expensive or lacked quality and purpose. That’s when Kuddoland was created—to offer toys that are fun, affordable, and thoughtfully chosen.<br/><br/>
            What began as a passion project has now grown into a trusted space where parents can find toys that truly add value to their child’s growth and happiness.
          </p>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-item"><span className="icon"><ShieldCheck size={18} /></span> Child-Safe Toys</div>
        <div className="trust-item"><span className="icon"><Truck size={18} /></span> Fast Delivery</div>
        <div className="trust-item"><span className="icon"><Award size={18} /></span> Top Quality</div>
        <div className="trust-item"><span className="icon"><CreditCard size={18} /></span> Secure Payments</div>
      </div>

      {/* WHAT WE OFFER */}
      <div className="section">
        <div className="section-header">
          <h2><Gift className="inline-icon" /> What We Offer</h2>
          <p>At Kuddoland, we carefully select toys that are not just entertaining but also help in a child’s overall development.</p>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon blue"><Smile /></div>
            <div className="why-text">
              <h4>Fun & Engaging</h4>
              <p>Toys that keep kids happily occupied</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon green"><Brain /></div>
            <div className="why-text">
              <h4>Educational Toys</h4>
              <p>Toys that support learning and creativity</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon orange"><Shield /></div>
            <div className="why-text">
              <h4>Safe & Durable</h4>
              <p>Products designed for everyday play</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon purple"><IndianRupee /></div>
            <div className="why-text">
              <h4>Budget-Friendly</h4>
              <p>Options so every child can enjoy quality toys</p>
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', fontWeight: '500', color: 'var(--muted)' }}>
          Every product we offer is chosen with care, keeping both kids and parents in mind.
        </p>
      </div>

      {/* OUR MISSION */}
      <div className="section">
        <div className="skills-wrap">
          <div className="skills-top">
            <div className="skills-emoji"><Rocket /></div>
            <div className="skills-top-text">
              <h3>Our Mission</h3>
              <p>Encouraging kids to learn, explore, and grow through play</p>
            </div>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--navy)', marginBottom: '16px' }}>
            Our mission is to make quality toys accessible to every family while encouraging kids to learn, explore, and grow through play. We aim to create a space where fun meets learning, and every toy adds something positive to a child’s life.
          </p>
        </div>
      </div>

      {/* SHOP WITH CONFIDENCE / WHY PARENTS TRUST US */}
      <div className="section">
        <div className="confidence-wrap">
          <h3><Heart className="inline-icon" /> Why Parents Trust Us</h3>
          <p>We understand that parents always want the best for their children. That’s why Kuddoland focuses on:</p>
          <div className="conf-grid">
            <div className="conf-card">
              <div className="conf-icon"><Shield /></div>
              <div className="conf-name">Safety First</div>
              <div className="conf-desc">Toys that are safe and suitable for kids</div>
            </div>
            <div className="conf-card">
              <div className="conf-icon"><Check /></div>
              <div className="conf-name">Quality You Can Rely On</div>
              <div className="conf-desc">Durable products that last longer</div>
            </div>
            <div className="conf-card">
              <div className="conf-icon"><IndianRupee /></div>
              <div className="conf-name">Affordable Choices</div>
              <div className="conf-desc">Great toys without high prices</div>
            </div>
            <div className="conf-card" style={{ gridColumn: '1 / -1' }}>
              <div className="conf-icon"><ShoppingBag /></div>
              <div className="conf-name">Easy Shopping Experience</div>
              <div className="conf-desc">Simple ordering through Instagram and quick responses</div>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Our goal is to make your buying experience smooth, reliable, and stress-free.
          </p>
        </div>
      </div>

      {/* DESTINATION / JOIN KUDDOLAND FAMILY */}
      <div className="section">
        <div className="destination-wrap">
          <div className="dest-emoji"><Users /></div>
          <h3>Join the Kuddoland Family</h3>
          <p>Kuddoland is not just about selling toys—it’s about building a community of happy kids and satisfied parents. Every order we receive is a step towards spreading smiles and creating joyful memories.</p>
          <p className="dest-sub" style={{ marginTop: '12px' }}>If you’re looking for toys that your child will love and you can trust, Kuddoland is here for you.</p>
        </div>
      </div>

      {/* CTA STRIP */}
      <div className="cta-strip">
        <div className="cta-strip-inner">
          <h2><ShoppingBag className="inline-icon" /> Explore our collection and bring home happiness today! <Smile className="inline-icon" /></h2>
          <p>Experience the joy of secure and easy Kids Toys Online Shopping today.</p>
          <Link to="/shop" className="cta-btn"><ArrowRight className="inline-icon" /> Shop Now & Spread Smiles!</Link>
        </div>
      </div>

    </div>
  );
}
