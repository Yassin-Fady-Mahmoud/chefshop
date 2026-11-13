import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';

/**
 * Every page is lazy loaded (loadComponent) -> smaller initial bundle, faster first paint.
 * Other members: replace the placeholder component behind your route; do not change the path/guard.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), title: 'ChefShop' },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), title: 'Login | ChefShop' },
  { path: 'signup', canActivate: [guestGuard], loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent), title: 'Sign up | ChefShop' },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), title: 'Profile | ChefShop' },

  // Member 2 - Store (admin + student)
  {
    path: 'store',
    canActivate: [roleGuard], data: { roles: ['admin', 'student'] },
    loadChildren: () => import('./store/store.routes').then(m => m.STORE_ROUTES),
    title: 'Store | ChefShop',
  },
  // Member 3 - Fees + Payroll
  {
    path: 'fees',
    canActivate: [roleGuard], data: { roles: ['admin', 'accountant', 'student'] }, // student sees only own invoices
    loadComponent: () => import('./features/fees/fees.component').then(m => m.FeesComponent),
    title: 'Student Fees | ChefShop',
  },
  {
    path: 'payroll',
    canActivate: [roleGuard], data: { roles: ['admin', 'accountant'] },
    loadComponent: () => import('./features/payroll/payroll.component').then(m => m.PayrollComponent),
    title: 'Payroll | ChefShop',
  },
  // Member 4 - Budget
  {
    path: 'budget',
    canActivate: [roleGuard], data: { roles: ['admin', 'accountant'] },
    loadComponent: () => import('./features/budget/budget.component').then(m => m.BudgetComponent),
    title: 'Budget | ChefShop',
  },

  { path: 'forbidden', loadComponent: () => import('./pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent), title: 'Access denied' },
  { path: '**', redirectTo: '' },
];

