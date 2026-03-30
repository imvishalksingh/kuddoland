import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductCard } from "../components/shop/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useCartStore } from "../store/cartStore";
import { useWishlist } from "../hooks/useWishlist";
import { Seo } from "../components/ui/Seo";
import useDataStore from "../store/useDataStore";

const promoCards = [
  {
    title: "Wood toys For your kids",
    body: "Get 20% flate your first purchase",
    image: "/cat5.png",
    bg: "linear-gradient(135deg, #f3c1b2 0%, #f7d9cf 100%)",
  },
  {
    title: "Early black friday specials",
    body: "Big discount 50% off on all order",
    image: "/cat6.png",
    bg: "linear-gradient(135deg, #cfd1f2 0%, #dfe3f6 100%)",
  },
  {
    title: "The best thing For kids",
    body: "Special offer gift voucher",
    image: "/banner.png",
    bg: "linear-gradient(135deg, #ddefbf 0%, #d7eea6 100%)",
  },
];

const ageItems = [
  { title: "0 - 12", subtitle: "months", image: "/age_bg_1.png" },
  { title: "1 - 2", subtitle: "years", image: "/age_bg_2.png" },
  { title: "3+", subtitle: "years", image: "/age_bg_3.png" },
  { title: "5+", subtitle: "years", image: "/age_bg_4.png" },
];

const newsItems = [
  {
    author: "Kuddoland Team",
    date: "28 Mar 2026",
    title: "Why Pretend Play Is Essential for Toddlers",
    body: "Pretend play is more than just fun. It helps children develop language and social skills...",
    image: "/cat2.png",
  },
  {
    author: "John Mathew",
    date: "14 Feb 2026",
    title: "What Are the Best Toys For Child Development",
    body: "Aliquet risus feugiat in ante. Est pellentesque elit ullamcorper dignissim...",
    image: "/cat3.png",
  },
  {
    author: "John Mathew",
    date: "10 Feb 2026",
    title: "How Do Toys Impact a Child's Learning",
    body: "Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque...",
    image: "/cat4.png",
  },
  {
    author: "Shivani",
    date: "05 Feb 2026",
    title: "Choosing Safe Materials for Newborns",
    body: "Ensuring your baby's toys are safe is our top priority. Learn what to look for...",
    image: "/cat5.png",
  },
  {
    author: "Jane Doe",
    date: "01 Feb 2026",
    title: "Top 10 Gifts for 1 Year Olds",
    body: "Finding the perfect gift for a first birthday can be tricky. Here are our top picks...",
    image: "/cat6.png",
  },
];

// --- Helper Components ---

function heroImageClass(position) {
  const base =
    "absolute top-1/2 left-1/2 h-auto w-[210px] -translate-y-1/2 object-contain transition-all duration-[900ms] ease-[cubic-bezier(0.77,0,0.175,1)] sm:w-[300px] lg:w-[420px]";

  if (position === "center") {
    return `${base} z-[3] translate-x-[-50%] scale-100 opacity-100 drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)]`;
  }
  if (position === "left") {
    return `${base} z-[2] translate-x-[-112%] scale-[0.62] opacity-50`;
  }
  if (position === "right") {
    return `${base} z-[2] translate-x-[10%] scale-[0.62] opacity-50`;
  }
  if (position === "hidden-left") {
    return `${base} z-[1] translate-x-[-160%] scale-[0.4] opacity-0`;
  }
  return `${base} z-[1] translate-x-[62%] scale-[0.4] opacity-0`;
}

function heroTextClass(position) {
  const base =
    "absolute inset-0 flex flex-col justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.77,0,0.175,1)]";

  if (position === "active") {
    return `${base} translate-y-0 opacity-100 pointer-events-auto`;
  }
  if (position === "prev") {
    return `${base} -translate-y-[60px] opacity-0 pointer-events-none`;
  }
  return `${base} translate-y-[60px] opacity-0 pointer-events-none`;
}

// --- Main HomePage Component ---

export function HomePage() {
  const { storefront } = useDataStore();
  const { data: products = [] } = useProducts({ featured: true });
  const { data: categories = [] } = useCategories();
  const [countdown, setCountdown] = useState({ days: 2, hours: 3, minutes: 48, seconds: 15 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(null);
  const [activeArrivalsFilter, setActiveArrivalsFilter] = useState("All");

  const heroSlides = storefront?.heroSliders || [];
  const homeSections = storefront?.homeSections || {};
  const brandItems = storefront?.brands || [];
  const availableOn = storefront?.availableOn || [];

  const prevSlideIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
  const nextSlideIndex = (currentSlide + 1) % heroSlides.length;

  const handleDragStart = (e) => {
    setStartX(e.clientX || e.touches?.[0]?.clientX);
  };

  const handleDragEnd = (e) => {
    if (startX === null) return;
    const endX = e.clientX || e.changedTouches?.[0]?.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentSlide(nextSlideIndex);
      else setCurrentSlide(prevSlideIndex);
    }
    setStartX(null);
  };

  // Cycle colours for category circles
  const CAT_BG = ["#d8ebbe", "#e7e7e7", "#f7d9ce", "#e5e5e5", "#d8d8ef", "#fde8d8", "#dde8f5", "#f5e6dd"];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        const total =
          current.days * 24 * 3600 +
          current.hours * 3600 +
          current.minutes * 60 +
          current.seconds -
          1;
        if (total <= 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return {
          days: Math.floor(total / 86400),
          hours: Math.floor((total % 86400) / 3600),
          minutes: Math.floor((total % 3600) / 60),
          seconds: total % 60,
        };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    const slider = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % heroSlides.length);
    }, 3500);

    return () => window.clearInterval(slider);
  }, [heroSlides.length]);

  const topPicks = useMemo(() => products.slice(0, 6), [products]);
  const arrivals = useMemo(() => products.slice(0, 6), [products]);

  const filteredArrivals = useMemo(() => {
    return arrivals.filter(p => {
      if (activeArrivalsFilter === "Under ₹600") return p.price < 600;
      if (activeArrivalsFilter === "Top Rated") return p.rating >= 4.7;
      if (activeArrivalsFilter === "On Sale") return (p.comparePrice || p.price + 100) - p.price > 150;
      return true;
    });
  }, [arrivals, activeArrivalsFilter]);

  const prevSlide = prevSlideIndex;
  const nextSlide = nextSlideIndex;

  return (
    <main className="bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-in { animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>
      <Seo title="Toy Time Home | Kuddosland" description="Pixel-matched Toy Time style home page." />

      {/* Hero Section */}
      <section
        className="bg-[#ede8df] select-none"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div className="page-shell min-h-[560px] py-8 sm:min-h-[640px] sm:py-10 lg:min-h-[700px] lg:py-0">
          <div className="grid min-h-[inherit] items-center gap-8 lg:grid-cols-[0.42fr_0.58fr]">
            <div className="order-2 px-2 text-center lg:order-1 lg:px-0 lg:pl-20 lg:text-left">
              <div className="relative mx-auto h-[250px] max-w-[540px] sm:h-[280px] lg:mx-0 lg:h-[310px]">
                {heroSlides.map((slide, index) => {
                  let position = "next";
                  if (index === currentSlide) position = "active";
                  else if (index === prevSlide) position = "prev";

                  return (
                    <div key={index} className={heroTextClass(position)}>
                      <p className="text-[12px] uppercase tracking-[0.18em] text-slate-900 sm:text-[15px] lg:text-[20px]">
                        {slide.subheading}
                      </p>
                      <h1 className="mt-4 font-body text-[42px] font-medium leading-[1.05] text-black sm:text-[56px] lg:max-w-[520px] lg:text-[72px]">
                        {slide.heading}
                      </h1>
                      <p className="mt-5 text-[20px] text-slate-800 sm:text-[22px] lg:mt-7 lg:text-[25px]">
                        {slide.price}
                      </p>
                      <div>
                        <Link
                          to={slide.ctaUrl || "/shop"}
                          className="mt-8 inline-flex rounded-[16px] bg-[#ff7f83] px-8 py-4 text-[16px] font-medium text-white sm:mt-9 sm:px-10 sm:py-5 sm:text-[18px] lg:mt-11 lg:rounded-[18px] lg:px-11 lg:py-6 lg:text-[19px]"
                        >
                          {slide.ctaText || "Shop now"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="order-1 flex items-center justify-center pt-4 lg:order-2 lg:justify-end lg:pt-0">
              <div className="relative h-[260px] w-full max-w-[340px] sm:h-[380px] sm:max-w-[520px] lg:h-[560px] lg:max-w-[760px]">
                {heroSlides.map((slide, index) => {
                  let position = "hidden-right";
                  if (index === currentSlide) position = "center";
                  else if (index === prevSlide) position = "left";
                  else if (index === nextSlide) position = "right";
                  else position = "hidden-left";

                  return (
                    <img
                      key={index}
                      className={heroImageClass(position)}
                      src={slide.image}
                      alt={slide.heading}
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="h-[72px] bg-white sm:h-[96px] lg:h-[150px]">
          <svg className="block h-full w-full" viewBox="0 0 1887 237" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <rect width="1887" height="237" fill="#eae7e0" />
            <polygon
              points="
                0,17 10,18 20,22 30,27 40,35 50,47 60,46 70,48 80,51 90,57
                100,66 110,82 120,118 130,120 140,128 150,133 160,132 170,134
                180,136 190,127 200,121 210,117 220,116 230,115 240,116 250,118
                260,123 270,129 280,126 290,122 300,124 310,131 320,143 330,143
                340,145 350,152 360,148 370,139 380,134 390,131 400,131 410,132
                420,135 430,141 440,141 450,120 460,109 470,101 480,96 490,94
                500,93 510,93 520,95 530,99 540,106 550,116 560,130 570,114
                580,106 590,100 600,96 610,94 620,95 630,97 640,101 650,108
                660,116 670,115 680,115 690,116 700,120 710,126 720,135 730,154
                740,171 750,170 760,174 770,169 780,161 790,159 800,160 810,166
                820,167 830,162 840,158 850,156 860,156 870,157 880,160 890,165
                900,160 910,154 920,155 930,160 940,171 950,168 960,169 970,172
                980,173 990,160 1000,152 1010,148 1020,146 1030,146 1040,148
                1050,152 1060,150 1070,122 1080,110 1090,102 1100,96 1110,93
                1120,92 1130,92 1140,95 1150,98 1160,104 1170,114 1180,125
                1190,123 1200,124 1210,129 1220,130 1230,134 1240,144 1250,150
                1260,160 1270,155 1280,146 1290,144 1300,138 1310,134 1320,135
                1330,120 1340,108 1350,101 1360,96 1370,94 1380,92 1390,93
                1400,95 1410,100 1420,106 1430,116 1440,136 1450,142 1460,138
                1470,133 1480,131 1490,131 1500,133 1510,138 1520,145 1530,158
                1540,155 1550,151 1560,150 1570,136 1580,125 1590,122 1600,124
                1610,131 1620,125 1630,119 1640,117 1650,115 1660,115 1670,117
                1680,120 1690,125 1700,133 1710,135 1720,132 1730,133 1740,132
                1750,122 1760,118 1770,94 1780,70 1790,59 1800,52 1810,48
                1820,47 1830,46 1840,38 1850,29 1860,23 1870,19 1880,17 1887,17
                1887,237 0,237
              "
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="page-shell pt-10 sm:pt-14 lg:pt-20">
        <h2 className="text-center font-body text-[38px] font-medium leading-none text-black sm:text-[48px] lg:text-[62px]">Shop By Category</h2>
        <div className="mt-10 flex gap-6 overflow-x-auto pb-4 sm:mt-12 sm:gap-8 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          {categories.slice(0, 5).map((item, i) => {
            const displayName = item.name.toLowerCase() === "stem kit" ? "Star Baby" : item.name;
            return (
              <Link key={item.id} to={`/shop?category=${item.slug}`} className="min-w-[170px] text-center sm:min-w-[190px] lg:min-w-0">
                <div className="mx-auto flex h-[148px] w-[148px] items-center justify-center rounded-full border border-dashed border-slate-400 bg-white p-[8px] sm:h-[170px] sm:w-[170px] lg:h-[182px] lg:w-[182px] lg:p-[10px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: CAT_BG[i % CAT_BG.length] }}>
                    <img className="h-full w-full object-cover" src={item.image || `/cat${(i % 6) + 1}.png`} alt={displayName} />
                  </div>
                </div>
                <p className="mt-5 font-body text-[22px] font-medium text-black sm:text-[24px] lg:mt-7 lg:text-[28px]">{displayName}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Promos */}
      <section className="page-shell pt-12 sm:pt-16 lg:pt-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {promoCards.map((card) => (
            <article key={card.title} className="group relative overflow-hidden rounded-[22px] min-h-[200px] sm:min-h-[240px] lg:rounded-[28px]" style={{ background: card.bg }}>
              <div className="relative z-10 flex h-full items-center p-6 sm:p-8 lg:p-10">
                <div className="max-w-[140px] sm:max-w-[180px] lg:max-w-[210px]">
                  <h3 className="font-body text-[20px] font-bold leading-tight text-black sm:text-[24px] lg:text-[28px]">{card.title}</h3>
                  <p className="mt-2 text-[13px] text-slate-700 sm:text-[14px] lg:mt-3 lg:text-[15px]">{card.body}</p>
                  <Link to="/shop" className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#ff8b87] px-6 text-[13px] font-bold text-white hover:bg-[#ff7777] transition-colors lg:mt-6 lg:h-12 lg:px-8 lg:text-[14px]">
                    Shop now
                  </Link>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-[55%] h-full">
                <img className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110" src={card.image} alt={card.title} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Age Filter */}
      <section className="page-shell pt-12 sm:pt-16 lg:pt-20">
        <h2 className="text-center font-body text-[38px] font-medium leading-none text-black sm:text-[48px] lg:text-[62px]">Shop By Age</h2>
        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {ageItems.map((item) => (
            <Link key={item.title} to={`/shop?age=${item.title.replace(/\s/g, "")}`} className="group flex justify-center transition-transform duration-300 hover:-translate-y-2">
              <div className="relative flex h-[126px] w-[220px] items-center justify-center bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110 sm:h-[148px] sm:w-[250px] lg:h-[170px] lg:w-[292px]" style={{ backgroundImage: `url(${item.image})` }}>
                <div className="text-center transition-opacity group-hover:opacity-90">
                  <p className="font-body text-[28px] font-bold text-black sm:text-[32px] lg:text-[38px] underline-offset-4 group-hover:underline">{item.title}</p>
                  <p className="text-[18px] text-slate-800 sm:text-[20px] lg:text-[24px]">{item.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offer & Top Picks */}
      <section className="page-shell pt-14 sm:pt-18 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_1.08fr]">
          <article className="overflow-hidden rounded-[24px] bg-[#eef5fb] lg:rounded-[34px]">
            <div className="px-5 pt-8 text-center sm:px-8 lg:px-12 lg:pt-10">
              <h2 className="font-body text-[44px] font-medium text-black sm:text-[52px] lg:text-[68px] leading-[1.1]">{homeSections.specialOfferHeading || "Special Offer"}</h2>
              <p className="mx-auto mt-3 max-w-[560px] text-[16px] text-black sm:text-[18px] lg:mt-4 lg:text-[20px]">Praesent tristique magna sit amet purus gravida quis blandit.</p>
              <Link to="/shop" className="mt-6 inline-flex rounded-[16px] bg-[#ff7f83] px-8 py-4 text-[16px] font-medium text-white sm:px-10 sm:py-4 sm:text-[17px] lg:mt-8 lg:rounded-[18px] lg:px-11 lg:py-5 lg:text-[18px]">
                Shop Now
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-4 px-4 text-center sm:px-8 lg:mt-10 lg:px-10">
              {[{ label: "Days", value: countdown.days }, { label: "Hrs", value: countdown.hours }, { label: "Mins", value: countdown.minutes }, { label: "Secs", value: countdown.seconds }].map((item, index) => (
                <div key={item.label} className="relative">
                  <p className="font-body text-[34px] font-medium leading-none text-black sm:text-[48px] lg:text-[68px]">{String(item.value).padStart(2, "0")}</p>
                  <p className="mt-3 text-[14px] text-black sm:text-[18px] lg:mt-6 lg:text-[22px]">{item.label}</p>
                  {index < 3 && <span className="absolute right-0 top-0 text-[34px] font-thin text-black/60 sm:text-[48px] lg:text-[70px]">|</span>}
                </div>
              ))}
            </div>
            <img className="mt-6 h-[360px] w-full object-cover sm:h-[520px] lg:mt-8 lg:h-[690px]" src="/hero2.png" alt="Special Offer" />
          </article>

          <div>
            <h2 className="font-body text-[40px] font-medium leading-[1.1] text-black sm:text-[48px] lg:text-[60px]">{homeSections.topPicksHeading || "Top Picks For Youngsters"}</h2>
            <p className="mt-4 text-[16px] text-slate-500 sm:text-[18px] lg:mt-6 lg:text-[20px]">Justo Eget Magna Fermentum Iaculis.</p>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:mt-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
              {topPicks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals (Redesigned) */}
      <section className="page-shell pt-14 sm:pt-18 lg:pt-24 border-t border-slate-100 mt-10">

        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">Toy Collection</p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-body text-[32px] font-extrabold leading-tight text-brand-ink sm:text-[42px] lg:text-[48px]">{homeSections.newArrivalsHeading || "New Arrivals"}</h2>
            <Link to="/shop" className="text-[12px] font-bold text-slate-500 border-b-2 border-slate-100 pb-0.5 hover:text-brand-ink hover:border-brand-ink transition-all">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-5 h-[3px] w-12 bg-brand-ink rounded-full" />
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
          {["All", "Under ₹99", "Under ₹299", "Under ₹499", "Top Rated", "On Sale"].map(f => (
            <button key={f} onClick={() => setActiveArrivalsFilter(f)} className={`whitespace-nowrap px-5 py-2 rounded-full border-2 text-[12px] font-bold tracking-wide transition-all ${activeArrivalsFilter === f ? "bg-brand-ink border-brand-ink text-white" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"}`}>
              {f}
            </button>
          ))}
          <span className="ml-auto text-[12px] font-medium text-slate-400 hidden sm:block">
            {filteredArrivals.length} items
          </span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-10 pt-4 hide-scrollbar snap-x snap-mandatory scroll-smooth px-1">
          {filteredArrivals.map((product, i) => (
            <div key={product.id} className="snap-start card-in w-[218px] flex-shrink-0" style={{ animationDelay: `${i * 100}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </section>

      {/* News & Brands */}
      <section className="page-shell py-12 sm:py-14">
        <div className="mb-10">
          <h2 className="font-body text-[38px] font-medium leading-none text-black sm:text-[48px] lg:text-[62px]">Latest News</h2>
          <p className="mt-4 text-[16px] text-slate-500 sm:text-[18px] lg:mt-5 lg:text-[20px]">Erat Velit Scelerisque In Dictum.</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article key={item.title}>
              <img className="h-[220px] w-full rounded-[22px] object-cover sm:h-[260px] lg:h-[280px] lg:rounded-[26px]" src={item.image} alt={item.title} />
              <p className="mt-5 text-[15px] text-slate-500 sm:text-[16px] lg:mt-6 lg:text-[18px]">{item.author} &nbsp; | &nbsp; {item.date}</p>
              <h3 className="mt-3 font-body text-[28px] font-medium leading-[1.3] text-black sm:text-[30px] lg:mt-4 lg:text-[34px]">{item.title}</h3>
              <p className="mt-3 max-w-[470px] text-[17px] leading-[1.55] text-black sm:text-[18px] lg:mt-4 lg:text-[20px]">{item.body}</p>
              <button className="mt-6 rounded-[16px] bg-[#ff7f83] px-8 py-4 text-[16px] font-medium text-white lg:mt-7 lg:rounded-[18px] lg:px-10 lg:py-5 lg:text-[18px]">Read More</button>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell pt-10 pb-6">
        <h2 className="text-center font-body text-[32px] font-medium leading-none text-black sm:text-[40px]">{homeSections.topBrandsHeading || "Top Brands With Us"}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5 lg:mt-8">
          {brandItems.map((brand) => (
            <div key={brand.label} className="flex h-[80px] items-center justify-center rounded-2xl border border-slate-200 bg-white sm:h-[100px] lg:h-[120px]">
              <span className="font-body text-[20px] font-medium sm:text-[24px]" style={{ color: brand.color || "#000" }}>{brand.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Available On */}
      {availableOn.length > 0 && (
        <section className="bg-slate-50 py-8">
          <div className="page-shell">
            <h2 className="text-center font-body text-[28px] font-medium text-black">We are Available On</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-6 sm:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              {availableOn.map((item) => (
                <div key={item.name} className="flex h-[40px] w-[100px] items-center justify-center sm:h-[50px] sm:w-[120px]">
                  <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact For Bulk Orders */}
      <section className="page-shell py-12 lg:py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="font-body text-[32px] sm:text-[40px] font-bold text-brand-ink">Contact Us For Bulk Orders</h2>
            <p className="text-slate-500 mt-2 text-[15px]">Looking to purchase toys for a school, daycare, or retail outlet? Fill out the form below and our wholesale team will get back to you.</p>
          </div>
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={e => { e.preventDefault(); alert("Bulk inquiry submitted. We will contact you soon!"); }}>
            <input type="text" placeholder="First Name" className="w-full rounded-xl border border-slate-200 px-5 py-3 text-[14px] outline-none focus:border-brand-coral focus:ring-1 focus:ring-brand-coral/50" required />
            <input type="text" placeholder="Last Name" className="w-full rounded-xl border border-slate-200 px-5 py-3 text-[14px] outline-none focus:border-brand-coral focus:ring-1 focus:ring-brand-coral/50" required />
            <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-slate-200 px-5 py-3 text-[14px] outline-none focus:border-brand-coral focus:ring-1 focus:ring-brand-coral/50" required />
            <input type="tel" placeholder="Phone Number" className="w-full rounded-xl border border-slate-200 px-5 py-3 text-[14px] outline-none focus:border-brand-coral focus:ring-1 focus:ring-brand-coral/50" required />
            <div className="sm:col-span-2">
              <textarea placeholder="Tell us about your requirements (items, estimated quantity, timeline)" rows="4" className="w-full rounded-xl border border-slate-200 px-5 py-4 text-[14px] outline-none focus:border-brand-coral focus:ring-1 focus:ring-brand-coral/50" required></textarea>
            </div>
            <div className="sm:col-span-2 mt-2">
              <button type="submit" className="w-full rounded-xl bg-brand-ink py-4 font-bold text-white transition-colors hover:bg-black text-[15px]">Submit Inquiry</button>
            </div>
          </form>
        </div>
      </section>

      {/* Premium Mobile App CTA */}
      <section className="page-shell my-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-black p-8 sm:p-10 lg:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-coral/20 blur-3xl mix-blend-screen"></div>
          
          <div className="relative z-10 max-w-md text-center md:text-left">
            <span className="inline-block px-3 py-1 mb-4 text-[11px] font-bold tracking-widest text-white uppercase bg-white/10 rounded-full border border-white/20">Coming Soon</span>
            <h2 className="font-display text-[28px] leading-tight font-medium text-white sm:text-[34px]">
              The entirely new Kuddoland mobile experience.
            </h2>
            <p className="mt-4 text-[14px] text-slate-300 leading-relaxed">
              Premium shopping, exclusive app drops, and lightning-fast checkout. Arriving on iOS and Android this fall.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-3 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md border border-white/20 transition hover:bg-white/20 opacity-70 cursor-not-allowed">
              <svg className="h-5 w-5" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              <span>App Store</span>
            </button>
            <button className="flex items-center justify-center gap-3 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md border border-white/20 transition hover:bg-white/20 opacity-70 cursor-not-allowed">
              <svg className="h-5 w-5" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
              <span>Google Play</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
