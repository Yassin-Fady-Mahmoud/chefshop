import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { INITIAL_INVOICES, Invoice } from './fees-data';

@Injectable({ providedIn: 'root' })
export class FeesService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = 'chefshop-fees';

  // All invoices (a signal, so the page updates by itself)
  readonly invoices = signal<Invoice[]>(this.load());

  // Totals
  readonly totalBilled = computed(() => this.invoices().reduce((s, i) => s + i.amount, 0));
  readonly totalPaid = computed(() =>
    this.invoices().filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  );
  readonly outstanding = computed(() => this.totalBilled() - this.totalPaid());

  // Only one student's invoices (for the student view)
  forStudent(username: string): Invoice[] {
    return this.invoices().filter(i => i.studentUsername === username);
  }

  createInvoice(data: Omit<Invoice, 'id' | 'status' | 'paidOn'>): void {
    const nextId = Math.max(0, ...this.invoices().map(i => i.id)) + 1;
    this.save([...this.invoices(), { ...data, id: nextId, status: 'unpaid' }]);
  }

  markPaid(id: number): void {
    const today = new Date().toISOString().slice(0, 10);
    this.save(this.invoices().map(i => (i.id === id ? { ...i, status: 'paid', paidOn: today } : i)));
  }

  // Local storage: invoices survive closing the browser
  private save(invoices: Invoice[]): void {
    this.invoices.set(invoices);
    if (this.isBrowser) localStorage.setItem(this.storageKey, JSON.stringify(invoices));
  }

  private load(): Invoice[] {
    if (!this.isBrowser) return INITIAL_INVOICES;
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  }
}