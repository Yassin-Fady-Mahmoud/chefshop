import { Injectable } from '@angular/core';

/**
 * One place for all browser storage so the choice of mechanism is explicit:
 *
 *  - localStorage   -> persistent, large, same-origin only, NOT sent to server.
 *                      Used for: mock user database, theme, cart (Member 2).
 *  - sessionStorage -> cleared when the tab closes.
 *                      Used for: the logged-in session (safer: auto-logout on close).
 *  - cookies        -> small, sent with every request, can expire / be SameSite.
 *                      Used for: "remember me" username, cookie-consent, last visit.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  // ---------- localStorage ----------
  getLocal<T>(key: string, fallback: T): T {
    return this.read<T>(localStorage, key, fallback);
  }
  setLocal(key: string, value: unknown): void {
    this.write(localStorage, key, value);
  }
  removeLocal(key: string): void {
    localStorage.removeItem(key);
  }

  // ---------- sessionStorage ----------
  getSession<T>(key: string, fallback: T): T {
    return this.read<T>(sessionStorage, key, fallback);
  }
  setSession(key: string, value: unknown): void {
    this.write(sessionStorage, key, value);
  }
  removeSession(key: string): void {
    sessionStorage.removeItem(key);
  }

  // ---------- cookies ----------
  setCookie(name: string, value: string, days = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
  }
  getCookie(name: string): string | null {
    const key = encodeURIComponent(name) + '=';
    for (const part of document.cookie.split('; ')) {
      if (part.startsWith(key)) return decodeURIComponent(part.substring(key.length));
    }
    return null;
  }
  deleteCookie(name: string): void {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }

  // ---------- helpers ----------
  private read<T>(store: Storage, key: string, fallback: T): T {
    try {
      const raw = store.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  }
  private write(store: Storage, key: string, value: unknown): void {
    try {
      store.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed (quota?)', e);
    }
  }
}
