// One money movement in a department
export interface BudgetEntry {
  id: number;
  department: Department;
  type: 'income' | 'expense';
  description: string;
  amount: number;
}

export type Department = 'Kitchen' | 'Catering' | 'Store';
export const DEPARTMENTS: Department[] = ['Kitchen', 'Catering', 'Store'];

// Mock data: no backend in Milestone 1
export const INITIAL_ENTRIES: BudgetEntry[] = [
  { id: 1, department: 'Kitchen', type: 'income', description: 'Ready meals sold', amount: 18000 },
  { id: 2, department: 'Kitchen', type: 'expense', description: 'Ingredients', amount: 9500 },
  { id: 3, department: 'Kitchen', type: 'expense', description: 'Gas and electricity', amount: 2200 },
  { id: 4, department: 'Catering', type: 'income', description: 'Wedding event', amount: 25000 },
  { id: 5, department: 'Catering', type: 'expense', description: 'Event ingredients', amount: 11000 },
  { id: 6, department: 'Catering', type: 'expense', description: 'Transport', amount: 3000 },
  { id: 7, department: 'Store', type: 'income', description: 'Knife kits and uniforms', amount: 14000 },
  { id: 8, department: 'Store', type: 'expense', description: 'Stock purchase', amount: 8000 },
];