import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <form class="panel" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <h2>Welcome back</h2>

        @if (error()) { <p class="alert" role="alert">{{ error() }}</p> }

        <label>Username
          <input formControlName="username" autocomplete="username" />
        </label>
        <label>Password
          <input type="password" formControlName="password" autocomplete="current-password" />
        </label>
        <label class="check"><input type="checkbox" formControlName="remember" /> Remember my username</label>

        <button class="btn btn-primary" [disabled]="form.invalid || busy()">{{ busy() ? 'Signing in…' : 'Login' }}</button>
        <p class="muted">New here? <a routerLink="/signup">Create an account</a></p>

        <details class="demo">
          <summary>Demo accounts</summary>
          <code>admin / admin123</code> · <code>accountant / acc123</code> · <code>student / stud123</code>
        </details>
      </form>
    </section>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error = signal('');
  busy = signal(false);

  form = this.fb.nonNullable.group({
    username: [this.auth.rememberedUsername(), Validators.required],
    password: ['', Validators.required],
    remember: [!!this.auth.rememberedUsername()],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.busy.set(true);
    const { username, password, remember } = this.form.getRawValue();
    const res = await this.auth.login(username, password, remember);
    this.busy.set(false);
    if (!res.ok) { this.error.set(res.error ?? 'Login failed.'); return; }
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    // only follow internal return URLs
    await this.router.navigateByUrl(returnUrl && returnUrl.startsWith('/') ? returnUrl : '/profile');
  }
}
