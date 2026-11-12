import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">Culinary School · Food Store</p>
        <h1>Learn to cook. <em>Taste</em> what students create.</h1>
        <p class="lead">
          ChefShop is a culinary institute with its own online store: professional kitchen tools, spices,
          uniforms and knife kits, plus ready meals cooked by our students.
        </p>
        <div class="cta">
          @if (auth.isLoggedIn()) {
            <a routerLink="/profile" class="btn btn-primary btn-lg">Go to my profile</a>
          } @else {
            <a routerLink="/signup" class="btn btn-primary btn-lg">Join / Sign up</a>
            <a routerLink="/login" class="btn btn-outline btn-lg">Login</a>
          }
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">🍳</div>
    </section>

    <section class="cards">
      <article class="card">
        <h3>🎓 The School</h3>
        <p>Hands-on modules in kitchen, pastry and catering. Pay module fees online and track your invoices.</p>
      </article>
      <article class="card">
        <h3>🛒 The Store</h3>
        <p>Knives, tools, spices, uniforms and ready meals, all in one cart with simple checkout.</p>
      </article>
      <article class="card">
        <h3>📊 Behind the Scenes</h3>
        <p>Admins and accountants manage payroll, student fees and department budgets with clear charts.</p>
      </article>
    </section>

    <section class="roles">
      <h2>Who uses ChefShop?</h2>
      <div class="cards">
        <article class="card"><h3>Student</h3><p>Buy from the store, view own fees and profile.</p></article>
        <article class="card"><h3>Accountant</h3><p>Fees, payroll and department budgets.</p></article>
        <article class="card"><h3>Admin</h3><p>Full access to everything.</p></article>
      </div>
    </section>
  `,
})
export class HomeComponent {
  auth = inject(AuthService);
}
