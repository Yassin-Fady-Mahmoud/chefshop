import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductList } from './product-list';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all 10 products at first', () => {
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length).toBe(10);
  });

  it('should filter by category', async () => {
    component.selectCategory('Spices');
    fixture.detectChanges();
    await fixture.whenStable();
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length).toBe(2);
  });
    it('should add to cart and show "Added ✓"', () => {
    const firstButton = fixture.nativeElement.querySelector('.bottom button') as HTMLButtonElement;
    firstButton.click();
    fixture.detectChanges();
    expect(component['cart'].count()).toBe(1);
    expect(firstButton.textContent).toContain('Added');
    expect(firstButton.classList).toContain('pop');
  });
});