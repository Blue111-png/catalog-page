import { Link } from 'react-router-dom';
import type { Product } from '../types';
import './productCard.css';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card__image">
        {primaryImage ? (
          <img src={primaryImage.url} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">
            <span>No Image</span>
          </div>
        )}
        {!product.inStock && <span className="product-card__badge">Out of Stock</span>}
      </div>
      <div className="product-card__info">
        {product.category && (
          <span className="product-card__category">{product.category.name}</span>
        )}
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{product.price.toFixed(2)}FCFA</p>
      </div>
    </Link>
  );
}