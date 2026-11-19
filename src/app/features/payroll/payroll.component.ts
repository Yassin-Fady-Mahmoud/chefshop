import { Component, PLATFORM_ID, inject } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from './payroll.service';
import { Staff } from './payroll-data';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.css',
})
export class PayrollComponent {
  protected readonly payroll = inject(PayrollService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Report month, e.g. '2026-11'
  protected month = new Date().toISOString().slice(0, 7);

  // Add-staff form
  protected name = '';
  protected job: Staff['job'] = 'Chef';
  protected baseSalary: number | null = null;

  addStaff(): void {
    if (!this.name || !this.baseSalary || this.baseSalary <= 0) return;
    this.payroll.addStaff({ name: this.name, job: this.job, baseSalary: this.baseSalary, allowances: 0, deductions: 0 });
    this.name = '';
    this.baseSalary = null;
  }

  // Called when an allowance or deduction box changes
  setNumber(s: Staff, field: 'allowances' | 'deductions', value: string): void {
    this.payroll.update(s.id, { [field]: Math.max(0, Number(value) || 0) });
  }

  // Download the monthly report as a .json file
  downloadReport(): void {
    if (!this.isBrowser) return;
    const json = JSON.stringify(this.payroll.report(this.month), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salary-report-${this.month}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}