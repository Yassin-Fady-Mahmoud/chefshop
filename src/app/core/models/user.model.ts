export type Role = 'admin' | 'accountant' | 'student';

export interface UserPreferences {
  theme: 'light' | 'dark';
  newsletter: boolean;
  favoriteCategory: 'tools' | 'spices' | 'ready-meals' | 'uniforms' | 'knife-kits';
}

export interface User {
  username: string;
  name: string;
  email: string;
  role: Role;
  picture: string; // data URL (small) or ''
  passwordHash: string;
  salt: string;
  cardLast4: string; // we NEVER store the full card number
  cardHolder: string;
  preferences: UserPreferences;
}

/** What is safe to keep in sessionStorage (no password data). */
export type SessionUser = Omit<User, 'passwordHash' | 'salt'>;

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  accountant: 'Accounting Personnel',
  student: 'Student',
};

/** What each role may access - used by the navbar and documented in the report. */
export const ROLE_ACCESS: Record<Role, string[]> = {
  admin: ['Home', 'Profile', 'Store', 'Student Fees', 'Staff Payroll', 'Department Budget'],
  accountant: ['Home', 'Profile', 'Student Fees', 'Staff Payroll', 'Department Budget'],
  student: ['Home', 'Profile', 'Store', 'My Fees'],
};
