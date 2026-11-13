import { Routes } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';

export const STORE_ROUTES: Routes = [
  { path: '', component: ProductList },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
];