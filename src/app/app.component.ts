import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main><router-outlet /></main>

    @if (!consented()) {
      <aside class="cookie-banner" role="dialog" aria-label="Cookie notice">
        <span>🍪 We use a cookie to remember your username and this choice. No tracking.</span>
        <button class="btn btn-primary" (click)="accept()">Got it</button>
      </aside>
    }
    <footer class="footer">© 2026 ChefShop Culinary School &amp; Food Store</footer>
  `,
})
export class AppComponent {
  private storage = inject(StorageService);
  consented = signal(this.storage.getCookie('chefshop_consent') === 'yes');

  accept(): void {
    this.storage.setCookie('chefshop_consent', 'yes', 365);
    this.consented.set(true);
  }
}
