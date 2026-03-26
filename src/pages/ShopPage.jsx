import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/shop/ProductCard";
import { Seo } from "../components/ui/Seo";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedAge, setSelectedAge] = useState(searchParams.get("age") || "All");
  
  const { data: products = [] } = useProducts();
  const bestSeller = products[0];

  useEffect(() => {
    const cat = searchParams.get("category");
    const age = searchParams.get("age");
    if (cat) setSelectedCategory(cat);
    if (age) setSelectedAge(age);
  }, [searchParams]);

  const maxPrice = useMemo(() => (products.length ? Math.max(...products.map((item) => item.price)) : 0), [products]);

  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category || "Toys").filter(Boolean))], [products]);
  const ageGroups = ["All", "0-12months", "1-2years", "3+years", "5+years"];

  const sortedProducts = useMemo(() => {
    let items = [...products];
    if (selectedCategory !== "All") {
      items = items.filter(item => (item.category || "Toys").toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedAge !== "All") {
      // Simple mapping for age groups if needed, or direct match
      items = items.filter(item => {
        const itemAge = (item.ageGroup || "").replace(/\s/g, "").toLowerCase();
        return itemAge.includes(selectedAge.toLowerCase()) || selectedAge.toLowerCase().includes(itemAge);
      });
    }
    
    if (sort === "price_asc") return items.sort((left, right) => left.price - right.price);
    if (sort === "price_desc") return items.sort((left, right) => right.price - left.price);
    return items.sort((left, right) => Number(right.featured) - Number(left.featured));
  }, [products, sort, selectedCategory, selectedAge]);

  return (
    <main className="bg-white">
      <Seo title="Collection | Kuddosland" description="Shop all toys with clickable product cards, wishlist, cart, and buy-now actions." />

      <section className="page-shell py-6">
        <div className="relative overflow-hidden rounded-[22px] bg-brand-gold">
          <img className="h-[250px] w-full object-cover opacity-60 mix-blend-multiply" src="/banner.png" alt="Collection hero" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-brand-ink drop-shadow-sm">All Toys</h1>
            <p className="mt-4 text-lg font-body font-medium text-brand-ink/80 bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">Home &gt; Shop &gt; All Toys</p>
          </div>
        </div>
      </section>

      <section className="page-shell py-10">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="border-r border-slate-200 pr-8">
            <h2 className="font-display text-4xl font-bold text-brand-ink">Storefront</h2>

            <div className="mt-10 space-y-10">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-brand-ink">Categories</h3>
                </div>
                <div className="space-y-2 flex flex-col">
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      className={`text-left text-lg font-body transition-colors ${selectedCategory === cat ? "text-brand-coral font-bold" : "text-slate-500 hover:text-brand-coral"}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchParams(prev => {
                          if (cat === "All") prev.delete("category");
                          else prev.set("category", cat);
                          return prev;
                        });
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

               <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-brand-ink">Age Group</h3>
                </div>
                <div className="space-y-2 flex flex-col">
                  {ageGroups.map((age) => (
                    <button 
                      key={age}
                      className={`text-left text-lg font-body transition-colors ${selectedAge === age ? "text-brand-coral font-bold" : "text-slate-500 hover:text-brand-coral"}`}
                      onClick={() => {
                        setSelectedAge(age);
                        setSearchParams(prev => {
                          if (age === "All") prev.delete("age");
                          else prev.set("age", age);
                          return prev;
                        });
                      }}
                    >
                      {age === "All" ? "All Ages" : age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-brand-ink">Price</h3>
                  <span className="text-brand-coral">+</span>
                </div>
                <p className="text-lg text-slate-500">The highest price is {formatCurrency(maxPrice)}</p>
              </div>

              {bestSeller ? (
                <div>
                  <h3 className="mb-6 font-display text-3xl font-bold text-brand-ink">Featured pick</h3>
                  <ProductCard product={bestSeller} compact />
                </div>
              ) : null}
            </div>
          </aside>

          <div>
            <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <p className="text-xl font-body text-slate-500">Showing <span className="font-bold text-brand-ink">{sortedProducts.length}</span> products</p>
              <select className="rounded-xl border-2 border-brand-peach bg-white px-5 py-3 text-lg font-body text-brand-ink focus:outline-none focus:border-brand-coral transition-colors" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Sort by: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {sortedProducts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-2xl text-slate-400 font-body">No products found in this category.</p>
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4 px-6 py-2 bg-brand-peach text-brand-coral rounded-full hover:bg-brand-coral hover:text-white transition-colors"
                >
                  View All
                </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {sortedProducts.length > 0 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button className="w-10 h-10 rounded-full border border-gray-200 flex flex-col items-center justify-center hover:bg-brand-peach text-gray-400 hover:text-brand-coral outline-none">&lt;</button>
                <button className="w-10 h-10 rounded-full bg-brand-coral text-white font-bold flex flex-col items-center justify-center outline-none">1</button>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex flex-col items-center justify-center hover:bg-brand-peach hover:text-brand-coral outline-none">2</button>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex flex-col items-center justify-center hover:bg-brand-peach hover:text-brand-coral text-gray-400 outline-none">&gt;</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
