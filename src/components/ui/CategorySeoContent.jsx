import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Palette, Dumbbell, Smile, Target, Sparkles, 
  Star, ArrowRight, CheckCircle, Globe, ShoppingBag, 
  HelpCircle, ChevronDown, Rocket, Baby, Milk
} from 'lucide-react';
import '../../styles/kuddo-seo.css';
import { CATEGORY_CONTENT } from '../../data/categoryContent';

const BenefitIcons = [Brain, Palette, Dumbbell, Smile];

const HeroIcons = {
  "0-1-year-kids-toy": Milk,
  "2-4-year-kids-toy": Palette,
  "5-8-year-kids-toy": Rocket,
  "9-12-year-kids-toy": Brain
};

export function CategorySeoContent({ categorySlug }) {
  const [openFaq, setOpenFaq] = useState(null);
  
  const content = CATEGORY_CONTENT[categorySlug] || null;
  if (!content) return null;

  const HeroIcon = HeroIcons[categorySlug] || Sparkles;

  return (
    <div className="kuddo-seo">
      
      {/* HERO */}
      <div className="hero">
        <h1><HeroIcon className="inline-icon" /> <span dangerouslySetInnerHTML={{ __html: content.heading.replace('|', '<br/><span>').concat('</span>') }} /></h1>
        <p>{content.intro}</p>
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '14px', maxWidth: '600px', margin: '0 auto', color: 'rgba(255,255,255,0.85)' }}>
            {content.introSub}
            {content.introSmall && <><br /><br />{content.introSmall}</>}
          </p>
        </div>
      </div>

      {/* WHY MATTER / BENEFITS */}
      {(content.whyMatterTitle || content.whyRightTitle || content.whyChooseTitle) && (
        <div className="section">
          <div className="section-header">
            <h2>{content.whyMatterTitle || content.whyRightTitle || content.whyChooseTitle}</h2>
            {(content.whyRightText || content.whyChooseText) && <p>{content.whyRightText || content.whyChooseText}</p>}
          </div>
          <div className="why-grid">
            {(content.benefits || content.benefitsList)?.map((benefit, idx) => {
              const Icon = BenefitIcons[idx % BenefitIcons.length];
              return (
                <div key={idx} className="why-card">
                  <div className={`why-icon ${['blue','green','orange','purple'][idx % 4]}`}><Icon size={20} /></div>
                  <div className="why-text">
                    <h4>{benefit.title}</h4>
                    <p>{benefit.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {content.foundationText && (
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', fontWeight: '500', color: 'var(--muted)' }}>
              {content.foundationText} {content.foundationText2}
            </p>
          )}
        </div>
      )}

      {/* EXPLORE TYPES */}
      {(content.exploreTitle || content.types) && (
        <div className="section">
          <div className="skills-wrap">
            <div className="skills-top">
              <div className="skills-emoji"><Target /></div>
              <div className="skills-top-text">
                <h3>{content.exploreTitle}</h3>
                <p>{content.exploreText}</p>
              </div>
            </div>
            
            {content.types && (
              <div className="skills-grid" style={{ gridTemplateColumns: '1fr', gap: '10px' }}>
                {content.types.map((type, idx) => (
                  <div key={idx} className="skill-pill" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={14} className="text-brand-coral" />
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{type.name}</div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--muted)', paddingLeft: '22px' }}>{type.text}</div>
                  </div>
                ))}
              </div>
            )}
            
            {content.features && (
               <div style={{ marginTop: '20px' }}>
                 {content.features.map((feature, idx) => (
                   <div key={idx} style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                     <Star size={14} className="text-brand-gold mt-1" />
                     <div style={{ fontSize: '13px', color: 'var(--navy)' }}>
                       <strong style={{ color: 'var(--navy)', fontSize: '14px' }}>{feature.title}:</strong> {feature.text}
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      )}

      {/* HOW TO CHOOSE */}
      {content.howToChooseTitle && (
        <div className="section">
          <div className="confidence-wrap">
            <h3>{content.howToChooseTitle}</h3>
            {content.howToChooseText && <p>{content.howToChooseText}</p>}
            <div className="conf-grid">
              {content.howToChooseTips.map((tip, idx) => (
                <div key={idx} className="conf-card">
                  <div className="conf-icon"><ArrowRight size={18} /></div>
                  <div className="conf-desc" style={{ color: 'white', fontSize: '12px' }}>
                    {typeof tip === 'string' ? tip : <><span style={{fontWeight:'bold'}}>{tip.title}:</span> {tip.text}</>}
                  </div>
                </div>
              ))}
            </div>
            {content.howToChooseConclusion && (
               <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                 {content.howToChooseConclusion}
               </p>
            )}
          </div>
        </div>
      )}

      {/* WHY SHOP */}
      {(content.whyShopTitle || content.shopTitle) && (
        <div className="section">
           <div className="section-header">
             <h2>{content.whyShopTitle || content.shopTitle}</h2>
           </div>
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
             {(content.whyShopPoints || content.shopPoints).map((point, idx) => (
               <div key={idx} style={{ background: 'white', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <CheckCircle size={14} className="text-green-500" /> {point}
               </div>
             ))}
           </div>
        </div>
      )}

      {/* CONCLUSION & CTA */}
      <div className="section">
        <div className="destination-wrap">
          <div className="dest-emoji"><Globe /></div>
          <p>{content.conclusion}</p>
        </div>
      </div>
      
      <div className="cta-strip">
        <div className="cta-strip-inner">
          <h2><ShoppingBag className="inline-icon" /> Find the Best Toys for Your Child!</h2>
          <p>Explore safe, fun, and educational kids toys online today.</p>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="cta-btn"><ArrowRight className="inline-icon" /> Browse Toys Now!</button>
        </div>
      </div>

      {/* FAQ */}
      {content.faqs && (
        <div className="section">
          <div className="section-header">
            <h2><HelpCircle className="inline-icon" /> Frequently Asked Questions</h2>
            <p>Everything you need to know</p>
          </div>
          <div className="faq-list">
            {content.faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button className={`faq-q ${openFaq === index ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.q}</span>
                  <ChevronDown className="chevron" />
                </button>
                <div className={`faq-a ${openFaq === index ? 'open' : ''}`}>
                  <p style={{ marginTop: '8px' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
