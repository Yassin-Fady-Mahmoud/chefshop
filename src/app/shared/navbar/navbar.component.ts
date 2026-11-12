import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_LABELS } from '../../core/models/user.model';

interface NavItem { label: string; path: string; roles?: string[]; }

const NAV: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Store', path: '/store', roles: ['admin', 'student'] },
  { label: 'Fees', path: '/fees', roles: ['admin', 'accountant', 'student'] },
  { label: 'Payroll', path: '/payroll', roles: ['admin', 'accountant'] },
  { label: 'Budget', path: '/budget', roles: ['admin', 'accountant'] },
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <a routerLink="/" class="brand" (click)="open.set(false)">👨‍🍳 Chef<span>Shop</span></a>

      <button class="burger" (click)="open.set(!open())" [attr.aria-expanded]="open()" aria-label="Toggle menu">☰</button>

      <nav [class.open]="open()">
        @for (item of items(); track item.path) {
          <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/' }"
             (click)="open.set(false)">{{ item.label }}</a>
        }

        @if (auth.user(); as u) {
          <a routerLink="/profile" routerLinkActive="active" class="user-chip" (click)="open.set(false)">
            @if (u.picture) { <img [src]="u.picture" alt="" /> } @else { <span class="avatar">{{ u.name[0] }}</span> }
            {{ u.username }} <small>({{ roleLabel() }})</small>
          </a>
          <button class="btn btn-ghost" (click)="toggleTheme()" [attr.aria-label]="'Toggle theme'">
            {{ u.preferences.theme === 'dark' ? '☀️' : '🌙' }}
          </button>
          <button class="btn btn-outline" (click)="logout()">Logout</button>
        } @else {
          <a routerLink="/login" class="btn btn-outline" (click)="open.set(false)">Login</a>
          <a routerLink="/signup" class="btn btn-primary" (click)="open.set(false)">Sign up</a>
        }
      </nav>
    </header>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  open = signal(false);

  /** Only show links the current role may open. */
  items = computed(() =>
    NAV.filter(i => !i.roles || (this.auth.role() !== null && i.roles.includes(this.auth.role()!))),
  );
  roleLabel = computed(() => (this.auth.role() ? ROLE_LABELS[this.auth.role()!] : ''));

  toggleTheme(): void {
    this.auth.setTheme(this.auth.user()?.preferences.theme === 'dark' ? 'light' : 'dark');
  }
  logout(): void {
    this.auth.logout();
    this.open.set(false);
    void this.router.navigateByUrl('/');
  }
}
