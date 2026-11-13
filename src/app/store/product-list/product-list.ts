import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, PRODUCTS } from '../products-data';
import { CartService } from '../cart-service';

@Component({
  imports: [RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  protected readonly cart = inject(CartService);
  protected readonly categories = CATEGORIES;
  protected readonly selectedCategory = signal('All');

  // Only the products of the chosen category
  protected readonly filteredProducts = computed(() =>
    this.selectedCategory() === 'All'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === this.selectedCategory())
  );

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}