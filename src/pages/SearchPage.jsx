import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/shop/ProductCard";
import { Seo } from "../components/ui/Seo";

export function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const urlQuery = new URLSearchParams(search).get("q") || "";
  const [searchInput, setSearchInput] = useState(urlQuery);
  const { data: products = [], isLoading } = useProducts({ search: urlQuery });

  useEffect(() => {
    setSearchInput(urlQuery);
  }, [urlQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate(`/shop`);
    }
  };

  return (
    <main className="page-shell space-y-10 py-12">
      <Seo title={urlQuery ? `Search results for "${urlQuery}" | Kuddoland` : "Search Toys | Kuddoland"} description="Find the perfect toy for your little one." />
      
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h1 className="font-display text-5xl font-extrabold text-brand-ink">
          {urlQuery ? `Results for "${urlQuery}"` : "Find the perfect toy"}
        </h1>
        
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto flex items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for bunnies, monkeys, teddy bears..."
            className="w-full rounded-full border-2 border-brand-peach bg-white px-6 py-4 pr-16 font-body text-lg text-slate-700 transition-colors focus:border-brand-coral focus:outline-none focus:ring-4 focus:ring-brand-coral/10 shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-coral p-3 text-white transition-transform hover:scale-105 shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>

        {urlQuery && !isLoading && (
          <p className="text-slate-500 font-body text-lg">
            Found <span className="font-bold text-brand-coral">{products.length}</span> {products.length === 1 ? 'toy' : 'toys'}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-[32px] border border-slate-100 bg-white p-4">
              <div className="aspect-[4/5] rounded-[24px] bg-slate-100 mb-4"></div>
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        urlQuery && (
          <div className="rounded-[40px] border-2 border-dashed border-brand-peach bg-orange-50/50 p-16 text-center max-w-2xl mx-auto shadow-inner">
            <div className="text-6xl mb-4 opacity-50">🫣</div>
            <h2 className="font-display text-3xl font-bold text-brand-ink mb-2">Oops! No toys found.</h2>
            <p className="text-lg text-slate-500 font-body mb-8">We couldn&apos;t find any magical creatures matching &quot;{urlQuery}&quot;. Try another search or explore our categories.</p>
            <button
              onClick={() => {
                setSearchInput("");
                navigate("/shop");
              }}
              className="inline-block rounded-full bg-brand-peach px-8 py-4 font-bold text-brand-coral shadow-sm transition-all hover:-translate-y-1 hover:bg-brand-coral hover:text-white"
            >
              Explore All Toys
            </button>
          </div>
        )
      )}
    </main>
  );
}
