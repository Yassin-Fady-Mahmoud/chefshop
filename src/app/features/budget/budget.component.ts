import { Component, ElementRef, afterNextRender, effect, inject, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { BudgetService } from './budget.service';
import { DEPARTMENTS, Department } from './budget-data';

Chart.register(...registerables);

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent {
  protected readonly budget = inject(BudgetService);
  protected readonly departments = DEPARTMENTS;

  // Form fields
  protected department: Department = 'Kitchen';
  protected type: 'income' | 'expense' = 'income';
  protected description = '';
  protected amount: number | null = null;

  // Table filter
  protected readonly filter = signal<Department | 'All'>('All');

  // The <canvas> elements in the HTML
  private readonly barCanvas = viewChild<ElementRef<HTMLCanvasElement>>('barChart');
  private readonly pieCanvas = viewChild<ElementRef<HTMLCanvasElement>>('pieChart');
  private barChart?: Chart;
  private pieChart?: Chart;

  constructor() {
    // Charts need a real browser, so create them only after the page is drawn
    afterNextRender(() => this.createCharts());

    // Every time the data changes, refresh the charts
    effect(() => {
      const rows = this.budget.byDepartment();
      if (this.barChart && this.pieChart) {
        this.barChart.data.datasets[0].data = rows.map(r => r.income);
        this.barChart.data.datasets[1].data = rows.map(r => r.expenses);
        this.pieChart.data.datasets[0].data = rows.map(r => r.expenses);
        this.barChart.update();
        this.pieChart.update();
      }
    });
  }

  protected filteredEntries() {
    const f = this.filter();
    return this.budget.entries().filter(e => f === 'All' || e.department === f);
  }

  addEntry(): void {
    if (!this.description || !this.amount || this.amount <= 0) return;
    this.budget.add({
      department: this.department,
      type: this.type,
      description: this.description,
      amount: this.amount,
    });
    this.description = '';
    this.amount = null;
  }

  private createCharts(): void {
    const rows = this.budget.byDepartment();
    const labels = rows.map(r => r.department);
    const text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#2b2118';
    Chart.defaults.color = text;

    const bar = this.barCanvas()?.nativeElement;
    if (bar) {
      this.barChart = new Chart(bar, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Income', data: rows.map(r => r.income), backgroundColor: '#2e7d32' },
            { label: 'Expenses', data: rows.map(r => r.expenses), backgroundColor: '#c8431b' },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    const pie = this.pieCanvas()?.nativeElement;
    if (pie) {
      this.pieChart = new Chart(pie, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ label: 'Expenses', data: rows.map(r => r.expenses), backgroundColor: ['#c8431b', '#e8a33d', '#7a6a5c'] }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }
  }
}