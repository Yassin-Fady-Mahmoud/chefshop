import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BudgetEntry, DEPARTMENTS, Department, INITIAL_ENTRIES } from './budget-data';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = 'chefshop-budget';

  // All entries (a signal, so the page and charts update by themselves)
  readonly entries = signal<BudgetEntry[]>(this.load());

  // Totals for the whole school
  readonly totalIncome = computed(() => this.sum('income'));
  readonly totalExpenses = computed(() => this.sum('expense'));
  readonly balance = computed(() => this.totalIncome() - this.totalExpenses());

  // Income, expenses and profit for each department (used by the table and the chart)
  readonly byDepartment = computed(() =>
    DEPARTMENTS.map(department => {
      const income = this.sum('income', department);
      const expenses = this.sum('expense', department);
      return { department, income, expenses, profit: income - expenses };
    })
  );

  add(entry: Omit<BudgetEntry, 'id'>): void {
    const nextId = Math.max(0, ...this.entries().map(e => e.id)) + 1;
    this.save([...this.entries(), { ...entry, id: nextId }]);
  }

  remove(id: number): void {
    this.save(this.entries().filter(e => e.id !== id));
  }

  reset(): void {
    this.save(INITIAL_ENTRIES);
  }

  private sum(type: 'income' | 'expense', department?: Department): number {
    return this.entries()
      .filter(e => e.type === type && (!department || e.department === department))
      .reduce((total, e) => total + e.amount, 0);
  }

  // Local storage: budget entries survive closing the browser
  private save(entries: BudgetEntry[]): void {
    this.entries.set(entries);
    if (this.isBrowser) localStorage.setItem(this.storageKey, JSON.stringify(entries));
  }

  private load(): BudgetEntry[] {
    if (!this.isBrowser) return INITIAL_ENTRIES;
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  }
}