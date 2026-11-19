import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { INITIAL_STAFF, Staff } from './payroll-data';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = 'chefshop-payroll';

  // All staff (a signal, so the page updates by itself)
  readonly staff = signal<Staff[]>(this.load());

  // Net pay = salary + allowances - deductions
  net(s: Staff): number {
    return s.baseSalary + s.allowances - s.deductions;
  }

  readonly totalNet = computed(() => this.staff().reduce((sum, s) => sum + this.net(s), 0));

  addStaff(data: Omit<Staff, 'id'>): void {
    const nextId = Math.max(0, ...this.staff().map(s => s.id)) + 1;
    this.save([...this.staff(), { ...data, id: nextId }]);
  }

  update(id: number, changes: Partial<Staff>): void {
    this.save(this.staff().map(s => (s.id === id ? { ...s, ...changes } : s)));
  }

  remove(id: number): void {
    this.save(this.staff().filter(s => s.id !== id));
  }

  // The monthly salary report as a plain object (turned into JSON for download)
  report(month: string) {
    return {
      school: 'ChefShop Culinary School',
      month,
      generatedAt: new Date().toISOString(),
      staff: this.staff().map(s => ({
        name: s.name,
        job: s.job,
        baseSalary: s.baseSalary,
        allowances: s.allowances,
        deductions: s.deductions,
        netPay: this.net(s),
      })),
      totalNetPay: this.totalNet(),
    };
  }

  // Local storage: payroll survives closing the browser
  private save(staff: Staff[]): void {
    this.staff.set(staff);
    if (this.isBrowser) localStorage.setItem(this.storageKey, JSON.stringify(staff));
  }

  private load(): Staff[] {
    if (!this.isBrowser) return INITIAL_STAFF;
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  }
}