export interface Image {
  id: number;
  url: string;
  publicId: string;
  isPrimary: boolean;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  slug: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  category?: Category;
  images: Image[];
}