import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct, deleteProduct } from '../api';
import type { Product } from '../types';
import './ProductPage.css';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getProduct(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!product || !confirm('Delete this product?')) return;
    setDeleting(true);
    await deleteProduct(product.id);
    navigate('/');
  };

  if (loading) return <div className="product-page__loading">Loading...</div>;
  if (!product) return <div className="product-page__loading">Product not found.</div>;

  const images = product.images;

  return (
    <main className="product-page">
      <div className="product-page__inner">
        <Link to="/" className="product-page__back">← Back to Catalog</Link>

        <div className="product-page__layout">
          <div className="product-page__gallery">
            <div className="product-page__main-image">
              {images[selectedImage] ? (
                <img src={images[selectedImage].url} alt={product.name} />
              ) : (
                <div className="product-page__no-image">No Image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-page__thumbs">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    className={`product-page__thumb ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  title='click' >
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-page__details">
            {product.category && (
              <span className="product-page__category">{product.category.name}</span>
            )}
            <h1 className="product-page__name">{product.name}</h1>
            <p className="product-page__price">${product.price.toFixed(2)}</p>

            <span className={`product-page__stock ${product.inStock ? 'in' : 'out'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>

            {product.description && (
              <p className="product-page__description">{product.description}</p>
            )}

            <button
              className="product-page__delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}