import { TestBed } from '@angular/core/testing';
import { PayrollService } from './payroll.service';

describe('PayrollService', () => {
  let service: PayrollService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollService);
  });

  it('should calculate net pay as salary + allowances - deductions', () => {
    const omar = service.staff()[0];
    expect(service.net(omar)).toBe(16500);
  });

  it('should calculate the total net pay', () => {
    expect(service.totalNet()).toBe(39200);
  });

  it('should update allowances and recalculate', () => {
    service.update(3, { allowances: 1500 });
    expect(service.net(service.staff()[2])).toBe(8900);
    expect(service.totalNet()).toBe(40200);
  });

  it('should build a monthly JSON report', () => {
    const report = service.report('2026-11');
    expect(report.month).toBe('2026-11');
    expect(report.staff.length).toBe(3);
    expect(report.totalNetPay).toBe(39200);
    expect(() => JSON.stringify(report)).not.toThrow();
  });
});