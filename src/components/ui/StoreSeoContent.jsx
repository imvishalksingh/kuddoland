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
      
      
      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-item"><span className="icon"><ShieldCheck size={18} /></span> Child-Safe Materials</div>
        <div className="trust-item"><span className="icon"><Truck size={18} /></span> Pan-India Delivery</div>
        <div className="trust-item"><span className="icon"><RotateCcw size={18} /></span> Easy Returns</div>
        <div className="trust-item"><span className="icon"><Lock size={18} /></span> Secure Payments</div>
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
