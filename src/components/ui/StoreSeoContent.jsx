import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Star, ShieldCheck, Truck, RotateCcw, Lock, Target, Heart, 
  Shield, IndianRupee, Gamepad2, ShoppingCart, Package, Puzzle, 
  Brain, Palette, Rocket, Activity, Smile, Phone, ShoppingBag, 
  ArrowRight, Gift, Globe, ChevronDown
} from 'lucide-react';
import '../../styles/kuddo-seo.css';

export function StoreSeoContent({ hideFaq = false }) {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "1. Where can I buy kids toys online in India?", a: "You can easily buy kids toys online from Kuddoland, a trusted online toy store offering a wide range of safe, fun, and educational toys for all age groups." },
    { q: "2. Are toys from Kuddoland safe for children?", a: "Yes, all toys available at Kuddoland are made from child-safe, non-toxic materials and meet quality standards to ensure complete safety for kids." },
    { q: "3. What types of toys are available online at Kuddoland?", a: "Kuddoland offers a variety of toys including educational toys, soft toys, activity toys, games, puzzles, and more to suit every child’s interest." },
    { q: "4. How do I choose the best toy for my child online?", a: "Choose toys based on your child’s age, interests, and learning needs. Always look for toys that are safe, engaging, and help in skill development." },
    { q: "5. Do you offer delivery across India?", a: "Yes, Kuddoland provides fast and reliable delivery across India, so you can enjoy hassle-free kids toys online shopping from anywhere." },
    { q: "6. Can toys help in my child’s learning and development?", a: "Absolutely! Toys play a major role in improving creativity, problem-solving skills, motor skills, and overall cognitive development." }
  ];

  return (
    <div className="kuddo-seo">
      
      
      {/* HERO */}
      <div className="hero">
        <h1><Sparkles className="inline-icon" /> Kids Toys Online – Fun, Learning & Smiles Delivered to Your Doorstep</h1>
        <p>Finding safe, fun, and meaningful toys for your child should make you feel confident. At <strong>Kuddoland</strong>, we make <strong>kids' toy shopping online</strong> simple, exciting, and trustworthy for every parent.</p>
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'Nunito', fontWeight: 800, marginBottom: '8px' }}><Star className="inline-icon text-yellow-400" /> Welcome to Kuddoland – Your Trusted Online Toys Store in India</h2>
          <p style={{ fontSize: '14px', maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.85)' }}>
            In today's busy life, parents often struggle to find the <strong>best toys for kids</strong> that are both entertaining and educational. Kuddoland brings you a carefully selected collection of toys that spark creativity, improve learning, and bring joy to every child.<br/>
            Whether you're buying <strong>toys online</strong> for birthdays, gifts, or daily fun, we ensure quality, safety, and happiness in every product, making your shopping experience easy and reliable.
          </p>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-item"><span className="icon"><ShieldCheck size={18} /></span> Child-Safe Materials</div>
        <div className="trust-item"><span className="icon"><Truck size={18} /></span> Pan-India Delivery</div>
        <div className="trust-item"><span className="icon"><RotateCcw size={18} /></span> Easy Returns</div>
        <div className="trust-item"><span className="icon"><Lock size={18} /></span> Secure Payments</div>
      </div>

      {/* WHY CHOOSE */}
      <div className="section">
        <div className="section-header">
          <h2><Target className="inline-icon" /> Why Choose Kuddoland?</h2>
          <p>We understand what parents want and what kids love <Heart className="inline-icon text-red-500" /></p>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '24px', fontSize: '15px', fontWeight: '500' }}>
          Kuddoland is designed to make your toy shopping experience stress-free and enjoyable.
        </p>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon blue"><Shield /></div>
            <div className="why-text">
              <h4>Safe & Child-Friendly Materials</h4>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon green"><IndianRupee /></div>
            <div className="why-text">
              <h4>Affordable Prices for Every Budget</h4>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon orange"><Gamepad2 /></div>
            <div className="why-text">
              <h4>Wide Variety of Toys for All Age Groups</h4>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon teal"><ShoppingCart /></div>
            <div className="why-text">
              <h4>Easy & Smooth Kids Toys Online Shopping Experience</h4>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon purple"><Package /></div>
            <div className="why-text">
              <h4>Fast & Reliable Delivery Across India</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* CATEGORIES */}
      <div className="section">
        <div className="section-header">
          <h2><Puzzle className="inline-icon" /> Explore Our Wide Range of Toys</h2>
          <p>Designed to Spark Creativity, Support Learning, and Bring Joy to Your Child</p>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>At Kuddoland, we offer a wide range of toys that match every child's interests:</p>
        </div>
        <div className="cat-grid">
          <Link to="/shop" className="cat-card">
            <span className="cat-emoji"><Brain /></span>
            <div className="cat-name">Educational Toys</div>
            <div className="cat-desc">Boost your child’s learning with toys that enhance thinking, memory, and problem-solving skills.</div>
          </Link>
          <Link to="/shop" className="cat-card">
            <span className="cat-emoji"><Sparkles /></span>
            <div className="cat-name">Soft Toys</div>
            <div className="cat-desc">Cute, cuddly, and comforting companions your kids will love to play and sleep with.</div>
          </Link>
          <Link to="/shop" className="cat-card">
            <span className="cat-emoji"><Palette /></span>
            <div className="cat-name">Activity Toys</div>
            <div className="cat-desc">Keep your child engaged with creative toys that inspire imagination and hands-on learning.</div>
          </Link>
          <Link to="/shop" className="cat-card">
            <span className="cat-emoji"><Puzzle /></span>
            <div className="cat-name">Games & Puzzles</div>
            <div className="cat-desc">Perfect for family time and improving focus, logic, and patience. No matter what you choose, every product is selected to deliver both fun and value.</div>
          </Link>
        </div>
      </div>

      <div className="divider"></div>

      {/* SKILLS & SMILES */}
      <div className="section">
        <div className="skills-wrap">
          <div className="skills-top">
            <div className="skills-emoji"><Rocket /></div>
            <div className="skills-top-text">
              <h3>More Than Just Toys | Building Skills & Smiles</h3>
              <p>Toys are not just for play, they shape a child’s future. Our collection helps in:</p>
            </div>
          </div>
          <div className="skills-grid">
            <div className="skill-pill"><span><Brain size={16} /></span> Developing cognitive skills</div>
            <div className="skill-pill"><span><Palette size={16} /></span> Enhancing creativity</div>
            <div className="skill-pill"><span><Activity size={16} /></span> Improving motor skills</div>
            <div className="skill-pill"><span><Smile size={16} /></span> Encouraging fun learning</div>
          </div>
          <div className="quote-box">At Kuddoland, every toy is a step towards your child's growth.</div>
        </div>
      </div>

      <div className="divider"></div>

      {/* SHOP WITH CONFIDENCE */}
      <div className="section">
        <div className="confidence-wrap">
          <h3><Lock className="inline-icon" /> Shop with Confidence</h3>
          <p>Your trust matters to us, and we make sure you feel secure while shopping:</p>
          <div className="conf-grid">
            <div className="conf-card">
              <div className="conf-icon"><ShieldCheck /></div>
              <div className="conf-name">Safe & Secure Payment Options</div>
            </div>
            <div className="conf-card">
              <div className="conf-icon"><RotateCcw /></div>
              <div className="conf-name">Easy Returns & Hassle-Free Process</div>
            </div>
            <div className="conf-card">
              <div className="conf-icon"><Phone /></div>
              <div className="conf-name">Friendly Customer Support</div>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>We are committed to giving you a smooth and reliable experience every time you shop.</p>
        </div>
      </div>

      {/* CTA STRIP */}
      <div className="cta-strip">
        <div className="cta-strip-inner">
          <h2><ShoppingBag className="inline-icon" /> Ready to Make Your Child Smile?</h2>
          <p>Ready to Make Your Child Smile? Start Your Easy and Secure <strong>Kids Toys Online Shopping</strong> Today</p>
          <Link to="/shop" className="cta-btn"><ArrowRight className="inline-icon" /> Shop now and grab exciting deals on your favorite toys!</Link>
          <p style={{ marginTop: '16px', fontSize: '13px', opacity: 0.9 }}><Gift className="inline-icon" /> Limited-time offers available – make every moment special <Gift className="inline-icon" /></p>
        </div>
      </div>

      {/* DESTINATION */}
      <div className="section">
        <div className="destination-wrap">
          <div className="dest-emoji"><Globe /></div>
          <h3>Your Go-To Destination for Kids' Toys Online</h3>
          <p>Kuddoland is growing as a trusted <strong>Online Toys Store in India</strong>, helping parents easily <strong>Buy Kids Toys Online</strong> without any hassle. Whether you're searching for fun, educational, or creative toys, we bring everything to your fingertips.</p>
          <p className="dest-sub">Skip the hassle of visiting the <strong>nearest toy shop</strong>—Kuddoland delivers happiness right to your home.</p>
        </div>
      </div>

      {!hideFaq && (
        <>
          <div className="divider"></div>
          {/* FAQ */}
          <div className="section">
            <div className="section-header">
              <div className="section-label">FAQs</div>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className={`faq-q ${openFaq === index ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {faq.q}
                    <ChevronDown className="chevron" />
                  </button>
                  <div className={`faq-a ${openFaq === index ? 'open' : ''}`}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
