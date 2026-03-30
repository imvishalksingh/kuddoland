import { Link } from 'react-router-dom';
import useDataStore from '../store/useDataStore';

export default function Footer() {
  const { storefront } = useDataStore();
  if (!storefront) return null;

  const email = storefront.supportEmail || "support@kuddoland.com";
  const phone = storefront.whatsappNumber || "+91-96905-60532";
  const socials = storefront.socialLinks || {};

  const defaultColumns = [
    {
      title: "Pages",
      links: [
        { label: "Our Story - Mission & Vision", url: "/about" },
        { label: "Media Coverage", url: "#" },
        { label: "FAQs", url: "/faqs" },
        { label: "Sponsorship", url: "#" }
      ]
    },
    {
      title: "Seller & Franchises",
      links: [
        { label: "Seller Registration", url: "#" },
        { label: "Franchise Model", url: "#" },
        { label: "Apply For Outlet", url: "#" },
        { label: "Kuddoland School", url: "#" },
        { label: "International Shopping", url: "#" },
        { label: "Brand Collaboration", url: "#" }
      ]
    },
    {
      title: "Our Policies",
      links: [
        { label: "Payment Policy", url: "#" },
        { label: "Refund Policy", url: "#" },
        { label: "Shipping Policy", url: "#" },
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms & Conditions", url: "/terms" }
      ]
    },
    {
      title: "Company Info",
      links: [
        { label: "Investor Relations", url: "#" },
        { label: "Pre School Admission", url: "#" },
        { label: "Openings & Hirings", url: "#" },
        { label: "Our Team", url: "/about" }
      ]
    }
  ];

  const columns = storefront.footerColumns?.length ? storefront.footerColumns : defaultColumns;

  return (
    <footer className="tt-footer bg-brand-ink text-white mt-10">
      <div className="footer-main py-12 lg:py-16">
        <div className="page-shell grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 lg:gap-4">
          {/* Columns 1-4 From Dynamic Storefront */}
          {columns.map(col => (
            <div key={col.title} className="footer-col space-y-4">
              <h4 className="font-body text-[16px] font-bold text-[#FFD6A5]">{col.title}</h4>
              <ul className="space-y-3">
                {col.links?.map(item => (
                  <li key={item.label}>
                    <Link className="text-[13px] text-white/70 hover:text-white transition-colors" to={item.url || "#"}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 5: Contact Us + Newsletter */}
          <div className="footer-col space-y-6">
            <h4 className="font-body text-[16px] font-bold text-[#FFD6A5]">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-[12px] text-white/60 font-semibold">Subscribe for exclusive deals & toy releases</p>
              <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                <input type="text" placeholder="Name" className="w-full text-[13px] px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-brand-coral" />
                <input type="email" placeholder="Email Address" className="w-full text-[13px] px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-brand-coral" />
                <button type="submit" className="w-full py-3 bg-[#ff8b87] text-white text-[13px] font-bold rounded-xl hover:bg-[#ff7777] transition shadow-lg">Submit</button>
              </form>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-[13px] text-white/60">
              <p>✉ {email}</p>
              <p>📞 {phone}</p>
            </div>
          </div>
        </div>

        {/* New Row for Addresses to balance height */}
        <div className="page-shell mt-12 pt-10 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <h5 className="text-[14px] font-bold text-[#FFD6A5]">Head Office</h5>
              <p className="text-[12px] text-white/50 leading-relaxed max-w-[280px]">
                Quarter Deck Queen Elizabeth 2 Ship - Port Rashid - Dubai UAE
              </p>
            </div>
            <div className="space-y-3">
              <h5 className="text-[14px] font-bold text-[#FFD6A5]">Corporate Office</h5>
              <p className="text-[12px] text-white/50 leading-relaxed max-w-[280px]">
                3rd Floor, Orchid Centre, Rapid Metro Station, near IILM Institute, next to Sector 54, Sector 53, Gurugram, Haryana 122002, India
              </p>
            </div>
            <div className="space-y-3">
              <h5 className="text-[14px] font-bold text-[#FFD6A5]">Branch Office</h5>
              <p className="text-[12px] text-white/50 leading-relaxed max-w-[280px]">
                Bus Stand, 371,372/1 Galleria Complex, Panchsheel Colony, Garh Rd, near Sohrab Gate, Meerut, Uttar Pradesh 250001
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/20 py-6 border-t border-white/5 mt-4">
        <div className="page-shell flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-widest text-white/40">
          <p>All Right Reserved Copyright 2020 Kuddosland Private Limited</p>

          <div className="flex gap-4 items-center">
            {socials.facebook && <a href={socials.facebook} target="_blank" rel="noreferrer" className="hover:text-brand-coral">Facebook</a>}
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-coral">Instagram</a>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" className="hover:text-brand-coral">Twitter</a>}
          </div>

          <p>Design & Developed by <a href="https://alphabusi.com" target="_blank" rel="noreferrer" className="text-white hover:text-brand-coral transition-colors">Alpha Wings Tech Group</a></p>
        </div>
      </div>
    </footer>
  );
}
