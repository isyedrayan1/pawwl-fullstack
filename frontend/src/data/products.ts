export interface Product {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  benefits: string[];
  ingredients?: string;
  usage: string;
  rating: string;
  reviewCount: number;
  images: string[];
  sizes: string[];
  tag?: string;
  slug: string;
}

export const products: Product[] = [];
