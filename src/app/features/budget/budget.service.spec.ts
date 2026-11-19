import { TestBed } from '@angular/core/testing';
import { BudgetService } from './budget.service';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetService);
  });

  it('should load the starting data', () => {
    expect(service.entries().length).toBe(8);
  });

  it('should calculate total income and expenses', () => {
    expect(service.totalIncome()).toBe(57000);
    expect(service.totalExpenses()).toBe(33700);
    expect(service.balance()).toBe(23300);
  });

  it('should calculate profit per department', () => {
    const kitchen = service.byDepartment().find(d => d.department === 'Kitchen')!;
    expect(kitchen.income).toBe(18000);
    expect(kitchen.expenses).toBe(11700);
    expect(kitchen.profit).toBe(6300);
  });

  it('should add an entry and update the totals', () => {
    service.add({ department: 'Store', type: 'income', description: 'Spices sold', amount: 1000 });
    expect(service.entries().length).toBe(9);
    expect(service.totalIncome()).toBe(58000);
  });

  it('should remove an entry', () => {
    service.remove(1);
    expect(service.entries().length).toBe(7);
    expect(service.totalIncome()).toBe(39000);
  });
});