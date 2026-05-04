import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, getCategories, createCategory } from '../api';
import type { Category } from '../types';
import './AddProductPage.css';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    slug: '',
    categoryId: '',
    inStock: 'true',
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: value };
      if (name === 'name' && !f.slug) {
        updated.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      return updated;
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const slug = newCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const cat = await createCategory({ name: newCategory, slug });
    setCategories(c => [...c, cat]);
    setForm(f => ({ ...f, categoryId: String(cat.id) }));
    setNewCategory('');
    setShowNewCat(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      const product = await createProduct(fd);
      navigate(`/products/${product.slug}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <main className="add-page">
      <div className="add-page__inner">
        <div className="add-page__header">
          <p className="add-page__sup">Catalog Management</p>
          <h1 className="add-page__title">Add New Product</h1>
        </div>

        <form className="add-page__form" onSubmit={handleSubmit}>
          <div className="add-page__image-section">
            <label className="add-page__upload" htmlFor="image-input">
              {preview ? (
                <img src={preview} alt="Preview" className="add-page__preview" />
              ) : (
                <div className="add-page__upload-placeholder">
                  <span className="add-page__upload-icon">+</span>
                  <span>Upload Image</span>
                </div>
              )}
            </label>
            <input
            className='image-hide'
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleImage}
              
            />
          </div>

          <div className="add-page__fields">
            <div className="add-page__field">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Lavender Essential Oil" />
            </div>

            <div className="add-page__field">
              <label>Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} required placeholder="e.g. lavender-essential-oil" />
            </div>

            <div className="add-page__field">
              <label>Price (USD) *</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="0.00" />
            </div>

            <div className="add-page__field">
              <label>Category</label>
              <div className="add-page__cat-row">
                <select name="categoryId" value={form.categoryId} onChange={handleChange} title='category'>
                  <option value="">No category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button type="button" className="add-page__cat-btn" onClick={() => setShowNewCat(v => !v)}>
                  + New
                </button>
              </div>
              {showNewCat && (
                <div className="add-page__cat-row add-page__cat-row--spacing">
                  <input
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Category name"
                  />
                  <button type="button" className="add-page__cat-btn" onClick={handleAddCategory}>Add</button>
                </div>
              )}
            </div>

            <div className="add-page__field">
              <label>Availability</label>
              <select name="inStock" value={form.inStock} onChange={handleChange} title='stock'>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            <div className="add-page__field add-page__field--full">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the product..." />
            </div>

            <div className="add-page__actions">
              <button type="submit" className="add-page__submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}