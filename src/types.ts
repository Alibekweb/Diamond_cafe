export type Language = 'uz' | 'ru' | 'en';

export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
}

export interface MenuItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  calories?: number;
  prepTime?: string;
  ingredients?: LocalizedString;
  spicy?: boolean;
  vegetarian?: boolean;
}

export interface Category {
  id: string;
  name: LocalizedString;
  icon?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  tableNumber: string;
  payToWaiter?: boolean;
  note?: string;
  createdAt: string;
  status: 'new' | 'preparing' | 'ready';
}

