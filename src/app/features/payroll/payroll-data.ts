// One staff member's pay for the month
export interface Staff {
  id: number;
  name: string;
  job: 'Chef' | 'Shop staff';
  baseSalary: number;
  allowances: number;   // e.g. catering-event allowance
  deductions: number;   // e.g. tax, absence
}

// Mock data: no backend in Milestone 1
export const INITIAL_STAFF: Staff[] = [
  { id: 1, name: 'Chef Omar Nabil', job: 'Chef', baseSalary: 15000, allowances: 3000, deductions: 1500 },
  { id: 2, name: 'Chef Laila Fathy', job: 'Chef', baseSalary: 14000, allowances: 2000, deductions: 1200 },
  { id: 3, name: 'Hany Samir', job: 'Shop staff', baseSalary: 8000, allowances: 500, deductions: 600 },
];