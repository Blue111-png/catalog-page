import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './productPage.css';
import { getProduct, deleteProduct, updateProduct, getCategories } from '../api';
import type { Product, Category } from '../types';


export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
const [categories, setCategories] = useState<Category[]>([]);
const [editForm, setEditForm] = useState({ name: '', price: '', description: '', inStock: 'true', categoryId: '' });
const [editImage, setEditImage] = useState<File | null>(null);
const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getProduct(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

useEffect(() => {
  getCategories().then(setCategories);
}, []);

  const handleDelete = async () => {
    if (!product || !confirm('Delete this product?')) return;
    setDeleting(true);
    await deleteProduct(product.id);
    navigate('/');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!product) return;
  setSaving(true);
  const fd = new FormData();
  Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
  fd.append('slug', product.slug);
  if (editImage) fd.append('image', editImage);
  const updated = await updateProduct(product.id, fd);
  setProduct(updated);
  setEditing(false);
  setSaving(false);
};

const handleEditClick = () => {
  setEditing(true);
  setEditForm({
    name: product!.name,
    price: String(product!.price),
    description: product!.description || '',
    inStock: String(product!.inStock),
    categoryId: String(product!.categoryId || ''),
  });
};

const handleWhatsApp = () => {
  if(!product) return;
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const message = `Hi! I'm interested in *${product.name}* priced at *$${product.price.toFixed(2)}*.${primaryImage ? `\n${primaryImage.url}` : ''}`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
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
                  title='click'>
                  <img src={img.url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-page__details">
          {editing ? (
            <form onSubmit={handleEditSubmit} className="product-page__edit-form">
              <div className="product-page__edit-field">
                <label>Name</label>
                <input title='name' value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="product-page__edit-field">
                <label>Price</label>
                <input title='price' type="number" step="0.01" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} required />
              </div>
              <div className="product-page__edit-field">
                <label>Category</label>
                <select title='category' value={editForm.categoryId} onChange={e => setEditForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">No category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="product-page__edit-field">
                <label>In Stock</label>
                <select title='stock' value={editForm.inStock} onChange={e => setEditForm(f => ({ ...f, inStock: e.target.value }))}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="product-page__edit-field">
                <label>Description</label>
                <textarea title='description' value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={4} />
              </div>
              <div className="product-page__edit-field">
                <label>New Image (optional)</label>
                <input title='image' type="file" accept="image/*" onChange={e => setEditImage(e.target.files?.[0] || null)} />
              </div>
              <div className="product-page__edit-actions">
                <button type="submit" className="product-page__save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="product-page__cancel" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
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

<button className="product-page__whatsapp" onClick={handleWhatsApp}>
  💬 Enquire on WhatsApp
</button>

              {localStorage.getItem('token') && (
                <div className="product-page__admin-actions">
                  <button className="product-page__edit" onClick={handleEditClick}>Edit Product</button>
                  <button className="product-page__delete" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Product'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </main>
);
}