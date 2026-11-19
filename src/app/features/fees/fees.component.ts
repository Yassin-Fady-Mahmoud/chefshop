import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { FeesService } from './fees.service';
import { MODULES, STUDENTS } from './fees-data';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.css',
})
export class FeesComponent {
  private readonly auth = inject(AuthService);
  protected readonly fees = inject(FeesService);
  protected readonly students = STUDENTS;
  protected readonly modules = MODULES;

  // Students only see their own invoices and can't create or mark paid
  protected readonly isStudent = computed(() => this.auth.role() === 'student');

  // Tabs: All / Unpaid / Paid (history)
  protected readonly tab = signal<'all' | 'unpaid' | 'paid'>('all');

  // Form fields
  protected studentUsername = STUDENTS[0].username;
  protected module = MODULES[0];
  protected amount: number | null = null;
  protected dueDate = '';

  // The invoices this user may see, filtered by the chosen tab
  protected readonly visibleInvoices = computed(() => {
    const user = this.auth.user();
    const mine = this.isStudent() && user ? this.fees.forStudent(user.username) : this.fees.invoices();
    return this.tab() === 'all' ? mine : mine.filter(i => i.status === this.tab());
  });

  createInvoice(): void {
    const student = STUDENTS.find(s => s.username === this.studentUsername);
    if (!student || !this.amount || this.amount <= 0 || !this.dueDate) return;
    this.fees.createInvoice({
      studentUsername: student.username,
      studentName: student.name,
      module: this.module,
      amount: this.amount,
      dueDate: this.dueDate,
    });
    this.amount = null;
    this.dueDate = '';
  }
}