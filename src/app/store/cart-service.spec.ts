import { TestBed } from '@angular/core/testing';
import { CartService } from './cart-service';
import { PRODUCTS } from './products-data';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should start empty', () => {
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('should add a product', () => {
    service.add(PRODUCTS[0]);
    expect(service.count()).toBe(1);
  });

  it('should increase quantity when adding the same product twice', () => {
    service.add(PRODUCTS[0]);
    service.add(PRODUCTS[0]);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
  });

  it('should calculate the total', () => {
    service.add(PRODUCTS[0]); // 450
    service.add(PRODUCTS[3]); // 45
    expect(service.total()).toBe(495);
  });

  it('should remove a product', () => {
    service.add(PRODUCTS[0]);
    service.remove(PRODUCTS[0].id);
    expect(service.count()).toBe(0);
  });

  it('should clear the cart', () => {
    service.add(PRODUCTS[0]);
    service.add(PRODUCTS[1]);
    service.clear();
    expect(service.items().length).toBe(0);
  });
});