import { Product } from './product';

// Mock data: no backend in Milestone 1
export const CATEGORIES = ['All', 'Kitchen Tools', 'Spices', 'Ready Meals', 'Uniforms', 'Knife Kits'];

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Chef Frying Pan', category: 'Kitchen Tools', price: 450, image: '/products/frying-pan.svg', description: 'Non-stick 28 cm pan' },
  { id: 2, name: 'Wooden Spoon Set', category: 'Kitchen Tools', price: 120, image: '/products/wooden-spoons.svg', description: 'Set of 5 beech spoons' },
  { id: 3, name: 'Saffron', category: 'Spices', price: 300, image: '/products/saffron.svg', description: 'Premium saffron, 2 g' },
  { id: 4, name: 'Cumin', category: 'Spices', price: 45, image: '/products/cumin.svg', description: 'Ground cumin, 100 g' },
  { id: 5, name: 'Chicken Pesto Pasta', category: 'Ready Meals', price: 180, image: '/products/pesto-pasta.svg', description: 'Basil pesto with grilled chicken' },
  { id: 6, name: 'Margherita Pizza', category: 'Ready Meals', price: 220, image: '/products/pizza.svg', description: 'Stone-baked, 30 cm' },
  { id: 7, name: 'Chef Jacket', category: 'Uniforms', price: 650, image: '/products/chef-jacket.svg', description: 'White cotton, all sizes' },
  { id: 8, name: 'Chef Hat', category: 'Uniforms', price: 90, image: '/products/chef-hat.svg', description: 'Classic toque' },
  { id: 9, name: 'Starter Knife Kit', category: 'Knife Kits', price: 1200, image: '/products/starter-knife-kit.svg', description: '3 knives + roll bag' },
  { id: 10, name: 'Pro Knife Kit', category: 'Knife Kits', price: 2500, image: '/products/pro-knife-kit.svg', description: '7 knives + sharpener' },
];