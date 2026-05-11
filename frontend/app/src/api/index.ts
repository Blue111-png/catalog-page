import axios from 'axios';
import type { Product, Category } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = (category?: string): Promise<Product[]> =>
  api.get('/products', { params: category ? { category } : {} }).then(r => r.data);

export const getProduct = (slug: string): Promise<Product> =>
  api.get(`/products/${slug}`).then(r => r.data);

export const createProduct = (formData: FormData): Promise<Product> =>
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deleteProduct = (id: number): Promise<void> =>
  api.delete(`/products/${id}`).then(r => r.data);

export const getCategories = (): Promise<Category[]> =>
  api.get('/categories').then(r => r.data);

export const createCategory = (data: { name: string; slug: string }): Promise<Category> =>
  api.post('/categories', data).then(r => r.data);

export const updateProduct = (id: number, formData: FormData): Promise<Product> =>
  api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deleteCategory = (id: number): Promise<void> =>
  api.delete(`/categories/${id}`).then(r => r.data);