import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart-service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {
  protected readonly cart = inject(CartService);

  // Form fields
  protected name = '';
  protected phone = '';
  protected address = '';
  protected payment = 'cash';

  protected readonly orderPlaced = signal(false);

  placeOrder(): void {
    this.cart.clear();
    this.orderPlaced.set(true);
  }
}