import { Seo } from "../components/ui/Seo";
import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <main className="page-shell py-16">
      <Seo title="About Us | Kuddoland" description="Learn more about the magic behind Kuddoland." />
      
      <div className="mx-auto max-w-4xl space-y-16">
        <section className="text-center space-y-6">
          <p className="chip mx-auto">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-brand-ink">Welcome to Kuddoland</h1>
          <p className="text-xl text-slate-600 font-body max-w-2xl mx-auto leading-relaxed">
            Where imagination meets cuddles. We believe every child deserves a magical companion to share their biggest dreams and coziest moments.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-[40px] bg-brand-peach/30 p-8 aspect-square flex items-center justify-center relative overflow-hidden">
             {/* Decorative blobs */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-peach rounded-bl-full opacity-50"></div>
             <div className="text-9xl relative z-10">🧸</div>
          </div>
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-brand-ink">Crafted with Love, Built for Hugs</h2>
            <p className="text-lg text-slate-600 font-body leading-relaxed">
              Founded in 2024, Kuddoland started with a simple idea: to create the softest, safest, and most lovable stuffed animals in the world. Our toys aren&apos;t just fabric and stuffing; they are keepsakes designed to withstand years of adventures and bedtime snuggles.
            </p>
            <p className="text-lg text-slate-600 font-body leading-relaxed">
              Every detail, from the embroidered eyes to the super-soft faux fur, is carefully chosen to ensure maximum adorableness and safety for your little ones.
            </p>
            <div className="pt-4">
              <Link to="/shop" className="inline-block rounded-full bg-brand-coral px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                Meet Our Friends
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function ContactPage() {
  return (
    <main className="page-shell py-16">
      <Seo title="Contact Us | Kuddoland" description="Get in touch with the Kuddoland team." />
      
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <p className="chip mx-auto">Get in Touch</p>
          <h1 className="font-display text-5xl font-extrabold text-brand-ink">We&apos;d love to hear from you!</h1>
          <p className="text-xl text-slate-600 font-body">Have a question about an order or just want to say hi? Send us a message.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          <div className="rounded-[32px] border border-brand-peach bg-white p-8 md:p-10 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-peach rounded-bl-full -z-10 opacity-30"></div>
             
             <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message! We'll get back to you soon."); }}>
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-brand-ink pl-1">Name</label>
                   <input required type="text" placeholder="Your name" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3.5 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-brand-ink pl-1">Email</label>
                   <input required type="email" placeholder="hello@example.com" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-3.5 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-brand-ink pl-1">Message</label>
                 <textarea required rows="5" placeholder="How can we help?" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-body focus:border-brand-coral focus:bg-white focus:outline-none transition-colors resize-none" />
               </div>
               <button type="submit" className="rounded-full bg-brand-coral px-10 py-4 text-lg font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
                 Send Message
               </button>
             </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-brand-ink text-white p-8">
              <h3 className="font-display text-2xl font-bold mb-6">Contact Info</h3>
              <div className="space-y-6 font-body">
                <div className="flex gap-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-bold text-brand-peach">Email</p>
                    <p className="text-slate-300">support@kuddoland.com</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-bold text-brand-peach">Phone</p>
                    <p className="text-slate-300">1-800-KUDDOS (583-367)</p>
                    <p className="text-sm text-slate-400 mt-1">Mon-Fri: 9am - 5pm EST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-[32px] bg-brand-mint/30 p-8 border border-brand-mint">
              <h3 className="font-display text-xl font-bold text-brand-ink mb-2">Looking for Answers?</h3>
              <p className="text-slate-600 font-body mb-4">Check out our frequently asked questions for quick info about shipping, returns, and toy care.</p>
              <Link to="/faq" className="text-brand-ink font-bold hover:text-brand-coral hover:underline flex items-center gap-1">
                Read FAQs <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function FaqPage() {
  const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. You will receive a tracking link via email once your order ships." },
    { q: "Are your toys safe for newborns?", a: "Yes! All our plush toys are carefully manufactured without hard plastic eyes or small detachable parts. The features are neatly embroidered to ensure they are 100% baby-safe." },
    { q: "How do I wash my Kuddoland toy?", a: "We recommend spot cleaning with a damp cloth and mild soap. For deeper cleans, place the toy in a mesh laundry bag and machine wash on a delicate, cold cycle. Air dry only." },
    { q: "What is your return policy?", a: "We offer a 30-day cuddle guarantee! If you're not completely satisfied, you can return your unwashed, undamaged toy within 30 days for a full refund." },
    { q: "Do you ship internationally?", a: "Currently, we only ship within the United States and Canada. We hope to bring Kuddoland toys to more countries soon!" }
  ];

  return (
    <main className="page-shell py-16">
      <Seo title="FAQ | Kuddoland" description="Frequently asked questions about Kuddoland." />
      
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="text-center space-y-4">
          <p className="chip mx-auto">FAQ</p>
          <h1 className="font-display text-5xl font-extrabold text-brand-ink">Common Questions</h1>
          <p className="text-xl text-slate-600 font-body">Everything you need to know about our toys and services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between font-display text-xl font-bold text-brand-ink transition-colors group-hover:text-brand-coral">
                {faq.q}
                <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-transform group-open:rotate-180">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <p className="mt-4 font-body text-slate-600 leading-relaxed pr-8">{faq.a}</p>
            </details>
          ))}
        </div>
        
        <div className="text-center pt-8 border-t border-slate-200">
          <p className="text-slate-600 font-body mb-4">Still have questions?</p>
          <Link to="/contact" className="inline-block rounded-full bg-slate-800 px-8 py-3 font-bold text-white transition-colors hover:bg-brand-coral">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}

export function TermsPrivacyPage() {
  return (
    <main className="page-shell py-16">
      <Seo title="Terms & Privacy | Kuddoland" description="Terms of service and privacy policy." />
      
      <div className="mx-auto max-w-3xl rounded-[40px] border border-brand-peach bg-white p-8 md:p-12 shadow-sm space-y-10">
        <div className="text-center border-b border-brand-peach pb-10">
          <h1 className="font-display text-4xl font-extrabold text-brand-ink mb-4">Terms & Privacy</h1>
          <p className="text-slate-500 font-body">Last updated: March 2024</p>
        </div>

        <section className="space-y-4 font-body leading-relaxed text-slate-600">
          <h2 className="font-display text-2xl font-bold text-brand-ink">1. Terms of Service</h2>
          <p>Welcome to Kuddoland. By accessing our website, you agree to be bound by these terms of service and agree that you are responsible for compliance with any applicable local laws.</p>
          <p>We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days&apos; notice prior to any new terms taking effect.</p>
        </section>

        <section className="space-y-4 font-body leading-relaxed text-slate-600">
          <h2 className="font-display text-2xl font-bold text-brand-ink">2. Privacy Policy</h2>
          <p>Your privacy is important to us. It is Kuddoland&apos;s policy to respect your privacy regarding any information we may collect from you across our website.</p>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
          <p>We don&apos;t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
        </section>

        <section className="space-y-4 font-body leading-relaxed text-slate-600">
          <h2 className="font-display text-2xl font-bold text-brand-ink">3. Secure Payments</h2>
          <p>All online payments are securely processed through trusted third-party payment gateways. We do not store your full credit card details on our servers.</p>
        </section>
      </div>
    </main>
  );
}
