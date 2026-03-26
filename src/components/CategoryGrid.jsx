import { Link } from 'react-router-dom';

const CATEGORIES = [
  { slug: 'stuffed-animals', label: 'Stuffed Animals', icon: '🧸', color: '#FFF4E5' },
  { slug: 'fantasy-animals', label: 'Fantasy Animals', icon: '🦄', color: '#F3E5F5' },
  { slug: 'teddies',         label: 'Teddies',         icon: '🐼', color: '#E8F5E9' },
  { slug: 'soft-dolls',      label: 'Soft Dolls',      icon: '👯', color: '#FCE4EC' },
  { slug: 'bath-toys',       label: 'Bath Toys',       icon: '🛁', color: '#E3F2FD' },
  { slug: 'teething-toys',   label: 'Teething Toys',   icon: '👶', color: '#FFFDE7' },
];

export default function CategoryGrid() {
  return (
    <section className="category-grid-section">
      <div className="tt-container">
        <div className="section-head text-center">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Explore our curated collections of premium soft toys.</p>
        </div>
        <div className="category-row">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} to={`/collections/${cat.slug}`} className="category-card" style={{ backgroundColor: cat.color }}>
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.label}</h3>
              <span className="category-btn">Explore →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
