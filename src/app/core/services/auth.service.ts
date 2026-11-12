import { Injectable, computed, inject, signal } from '@angular/core';
import { Role, SessionUser, User, UserPreferences } from '../models/user.model';
import { StorageService } from './storage.service';

const USERS_KEY = 'chefshop.users';
const SESSION_KEY = 'chefshop.session';
const REMEMBER_COOKIE = 'chefshop_remember';

export interface SignupData {
  username: string;
  name: string;
  email: string;
  password: string;
  picture: string;
  cardNumber: string;
  cardHolder: string;
  preferences: UserPreferences;
}

/**
 * Mock authentication (Milestone 1: client side only).
 * State strategy: a signal holds the current user so every component
 * (navbar, guards, profile) reacts automatically; sessionStorage keeps it
 * across page refreshes within the tab.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);

  private _user = signal<SessionUser | null>(this.storage.getSession<SessionUser | null>(SESSION_KEY, null));
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly role = computed<Role | null>(() => this._user()?.role ?? null);

  constructor() {
    void this.seedUsers();
    this.applyTheme(this._user()?.preferences.theme ?? 'light');
  }

  // ---------- public API ----------
  async signup(data: SignupData): Promise<{ ok: boolean; error?: string }> {
    const users = this.allUsers();
    if (users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { ok: false, error: 'That username is already taken.' };
    }
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'That email is already registered.' };
    }
    const salt = this.randomSalt();
    const user: User = {
      username: data.username.trim(),
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'student', // public signup always creates students; admin promotes others
      picture: data.picture,
      salt,
      passwordHash: await this.hash(data.password, salt),
      cardLast4: data.cardNumber.replace(/\D/g, '').slice(-4),
      cardHolder: data.cardHolder.trim(),
      preferences: data.preferences,
    };
    this.saveUsers([...users, user]);
    return { ok: true };
  }

  async login(username: string, password: string, remember: boolean): Promise<{ ok: boolean; error?: string }> {
    await this.seedUsers(); // make sure demo accounts exist on first ever visit
    const user = this.allUsers().find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user || (await this.hash(password, user.salt)) !== user.passwordHash) {
      return { ok: false, error: 'Invalid username or password.' };
    }
    this.startSession(user);
    if (remember) this.storage.setCookie(REMEMBER_COOKIE, user.username, 14);
    else this.storage.deleteCookie(REMEMBER_COOKIE);
    return { ok: true };
  }

  logout(): void {
    this.storage.removeSession(SESSION_KEY);
    this._user.set(null);
    this.applyTheme('light');
  }

  rememberedUsername(): string {
    return this.storage.getCookie(REMEMBER_COOKIE) ?? '';
  }

  updateProfile(changes: Partial<Pick<User, 'name' | 'email' | 'picture' | 'preferences'>>): void {
    const current = this._user();
    if (!current) return;
    const users = this.allUsers().map(u => (u.username === current.username ? { ...u, ...changes } : u));
    this.saveUsers(users);
    const updated = users.find(u => u.username === current.username)!;
    this.startSession(updated);
  }

  setTheme(theme: 'light' | 'dark'): void {
    const current = this._user();
    if (current) this.updateProfile({ preferences: { ...current.preferences, theme } });
    else this.applyTheme(theme);
  }

  hasRole(...roles: Role[]): boolean {
    const r = this.role();
    return r !== null && roles.includes(r);
  }

  // ---------- internals ----------
  private startSession(user: User): void {
    const { passwordHash, salt, ...safe } = user;
    this.storage.setSession(SESSION_KEY, safe);
    this._user.set(safe);
    this.applyTheme(safe.preferences.theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private allUsers(): User[] {
    return this.storage.getLocal<User[]>(USERS_KEY, []);
  }
  private saveUsers(users: User[]): void {
    this.storage.setLocal(USERS_KEY, users);
  }

  private randomSalt(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  private async hash(password: string, salt: string): Promise<string> {
    const data = new TextEncoder().encode(salt + password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  }

  /** Demo accounts so every role can be tested immediately. */
  private async seedUsers(): Promise<void> {
    if (this.allUsers().length > 0) return;
    const mk = async (username: string, name: string, role: Role, pw: string): Promise<User> => {
      const salt = this.randomSalt();
      return {
        username, name, role, email: `${username}@chefshop.test`, picture: '',
        salt, passwordHash: await this.hash(pw, salt),
        cardLast4: '4242', cardHolder: name,
        preferences: { theme: 'light', newsletter: false, favoriteCategory: 'spices' },
      };
    };
    // Re-check after awaits so concurrent callers don't double-seed.
    const seeded = [
      await mk('admin', 'Head Chef Admin', 'admin', 'admin123'),
      await mk('accountant', 'Alex Accountant', 'accountant', 'acc123'),
      await mk('student', 'Sam Student', 'student', 'stud123'),
    ];
    if (this.allUsers().length === 0) this.saveUsers(seeded);
  }
}
