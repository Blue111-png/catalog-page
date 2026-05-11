import { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../api';
import type { Product, Category } from '../types';
import ProductCard from '../components/productCard';
import './catalogPage.css';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(activeCategory || undefined)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <main className="catalog">
      <div className="catalog__hero">
        <p className="catalog__hero-sub">Natural &amp; Demure</p>
        <h1 className="catalog__hero-title">Our Collection</h1>
      </div>

      <div className="catalog__inner">
        <aside className="catalog__sidebar">
          <p className="catalog__filter-label">Filter by</p>
          <button
            className={`catalog__filter-btn ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`catalog__filter-btn ${activeCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name}
              <span className="catalog__filter-count">{cat._count?.products ?? ''}</span>
            </button>
          ))}
        </aside>

        <section className="catalog__grid-wrap">
          {loading ? (
            <div className="catalog__loading">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="catalog__skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="catalog__empty">
              <p>No products found.</p>
              <a href="/add">Add your first product →</a>
            </div>
          ) : (
            <div className="catalog__grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}