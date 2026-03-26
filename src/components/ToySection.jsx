import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

export default function ToySection({ id, title, subtitle, products }) {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  // Helper function to extract primary image
  const getPrimaryProductImage = (product) => {
    if (!product?.imageUrl) return "";
    return String(product.imageUrl).split(/[\n,]+/).map((item) => item.trim()).filter(Boolean)[0] || "";
  };

  return (
    <section id={id} className="tt-products">
      <div className="tt-container">
        <div className="section-head">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-sub">{subtitle}</p>}
        </div>
        <div className="tt-product-grid">
          {products.map(product => (
            <article
              key={product.id}
              className="tt-card"
              onClick={() => navigate(`/products/${product.slug}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate(`/products/${product.slug}`);
                }
              }}
            >
              <div className="tt-card-img">
                {product.compareAtPrice && <span className="sale-label">Sale</span>}
                {product.imageUrl
                  ? <img src={getPrimaryProductImage(product)} alt={product.name} />
                  : <span className="tt-emoji">{product.emoji}</span>}
              </div>
              <div className="tt-card-body">
                <h3>{product.name}</h3>
                <div className="tt-stars">★★★★★</div>
                <div className="tt-price-row">
                  <span className="tt-price">{product.price}</span>
                  {product.compareAtPrice && <del className="tt-was">{product.compareAtPrice}</del>}
                </div>
                <button 
                  type="button" 
                  className="tt-add-btn" 
                  onClick={(event) => { 
                    event.stopPropagation(); 
                    addToCart(product.id); 
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="section-dots">
          <span className="sdot sdot--active" /><span className="sdot" /><span className="sdot" />
        </div>
      </div>
    </section>
  );
}
