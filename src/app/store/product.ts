// The shape of one product in the store
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

// One line in the cart: a product + how many
export interface CartItem {
  product: Product;
  quantity: number;
}