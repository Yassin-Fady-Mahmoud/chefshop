import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, PRODUCTS } from '../products-data';
import { Product } from '../product';
import { CartService } from '../cart-service';
import { SoundService } from '../sound-service';

@Component({
  imports: [RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  protected readonly cart = inject(CartService);
  private readonly sound = inject(SoundService);
  protected readonly categories = CATEGORIES;
  protected readonly selectedCategory = signal('All');

  // 🆕 Animation state
  protected readonly popId = signal<number | null>(null); // which button is popping
  protected readonly cartBump = signal(false);            // is the cart button bumping
  private popTimer?: ReturnType<typeof setTimeout>;

  // Only the products of the chosen category
  protected readonly filteredProducts = computed(() =>
    this.selectedCategory() === 'All'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === this.selectedCategory())
  );

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  // 🆕 Add to cart + ding + pop + bump
  addToCart(product: Product): void {
    this.cart.add(product);
    this.sound.ding();

    clearTimeout(this.popTimer);       // handles fast double-clicks
    this.popId.set(product.id);
    this.cartBump.set(true);
    this.popTimer = setTimeout(() => {
      this.popId.set(null);
      this.cartBump.set(false);
    }, 600);
  }
}