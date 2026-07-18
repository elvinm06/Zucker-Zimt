export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Up to 5 URLs; images[0] is the cover. */
  images: string[];
  ingredients: string[];
  allergens: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductPayload = Omit<
  Product,
  'id' | 'created_at' | 'updated_at'
>;
