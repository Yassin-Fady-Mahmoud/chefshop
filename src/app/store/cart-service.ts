import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, Product } from './product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = 'chefshop-cart';

  // The cart list (a signal, so the page updates by itself)
  readonly items = signal<CartItem[]>(this.load());

  // Values calculated automatically from the cart
  readonly count = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));
  readonly total = computed(() => this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0));

  add(product: Product): void {
    const existing = this.items().find(i => i.product.id === product.id);
    if (existing) {
      this.setQuantity(product.id, existing.quantity + 1);
    } else {
      this.save([...this.items(), { product, quantity: 1 }]);
    }
  }

  setQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.save(this.items().map(i => (i.product.id === productId ? { ...i, quantity } : i)));
  }

  remove(productId: number): void {
    this.save(this.items().filter(i => i.product.id !== productId));
  }

  clear(): void {
    this.save([]);
  }

  // Local storage: the cart survives closing the browser
  private save(items: CartItem[]): void {
    this.items.set(items);
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  private load(): CartItem[] {
    if (!this.isBrowser) return [];
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }
}