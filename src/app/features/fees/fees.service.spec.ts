import { TestBed } from '@angular/core/testing';
import { FeesService } from './fees.service';

describe('FeesService', () => {
  let service: FeesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeesService);
  });

  it('should load the starting invoices', () => {
    expect(service.invoices().length).toBe(4);
  });

  it('should calculate billed, collected and outstanding', () => {
    expect(service.totalBilled()).toBe(15200);
    expect(service.totalPaid()).toBe(7000);
    expect(service.outstanding()).toBe(8200);
  });

  it('should create an unpaid invoice', () => {
    service.createInvoice({ studentUsername: 'mona', studentName: 'Mona Hassan', module: 'Knife Skills', amount: 3000, dueDate: '2026-12-10' });
    const created = service.invoices().at(-1)!;
    expect(created.status).toBe('unpaid');
    expect(service.totalBilled()).toBe(18200);
  });

  it('should mark an invoice as paid with a date', () => {
    service.markPaid(2);
    const invoice = service.invoices().find(i => i.id === 2)!;
    expect(invoice.status).toBe('paid');
    expect(invoice.paidOn).toBeTruthy();
    expect(service.outstanding()).toBe(5200);
  });

  it('should return only one student\'s invoices', () => {
    const mine = service.forStudent('student');
    expect(mine.length).toBe(2);
    expect(mine.every(i => i.studentUsername === 'student')).toBe(true);
  });
});