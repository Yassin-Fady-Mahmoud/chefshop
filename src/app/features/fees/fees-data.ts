// One invoice for one student
export interface Invoice {
  id: number;
  studentUsername: string;
  studentName: string;
  module: string;
  amount: number;
  dueDate: string;          // 'YYYY-MM-DD'
  status: 'unpaid' | 'paid';
  paidOn?: string;          // filled when marked paid
}

// Students and modules (mock data: no backend in Milestone 1)
// 'student' is Member 1's demo login, so it can see its own invoices
export const STUDENTS = [
  { username: 'student', name: 'Sam Student' },
  { username: 'mona', name: 'Mona Hassan' },
  { username: 'karim', name: 'Karim Adel' },
];

export const MODULES = ['Pastry Basics', 'Italian Cuisine', 'Knife Skills', 'Food Safety'];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 1, studentUsername: 'student', studentName: 'Sam Student', module: 'Pastry Basics', amount: 4500, dueDate: '2026-10-01', status: 'paid', paidOn: '2026-09-28' },
  { id: 2, studentUsername: 'student', studentName: 'Sam Student', module: 'Knife Skills', amount: 3000, dueDate: '2026-12-01', status: 'unpaid' },
  { id: 3, studentUsername: 'mona', studentName: 'Mona Hassan', module: 'Italian Cuisine', amount: 5200, dueDate: '2026-11-15', status: 'unpaid' },
  { id: 4, studentUsername: 'karim', studentName: 'Karim Adel', module: 'Food Safety', amount: 2500, dueDate: '2026-10-20', status: 'paid', paidOn: '2026-10-18' },
];