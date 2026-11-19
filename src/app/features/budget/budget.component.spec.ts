import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetComponent } from './budget.component';

describe('BudgetComponent', () => {
  let component: BudgetComponent;
  let fixture: ComponentFixture<BudgetComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [BudgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show one row per department in the profit table', () => {
    const firstTableRows = fixture.nativeElement.querySelector('table tbody').querySelectorAll('tr');
    expect(firstTableRows.length).toBe(3);
  });
});