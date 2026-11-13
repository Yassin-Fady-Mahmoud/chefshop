import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/** Luhn check so obviously fake card numbers are rejected. */
function luhn(control: AbstractControl): ValidationErrors | null {
  const digits = String(control.value ?? '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return { card: true };
  let sum = 0;
  digits.split('').reverse().forEach((d, i) => {
    let n = +d;
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  });
  return sum % 10 === 0 ? null : { card: true };
}

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <form class="panel wide" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <h2>Create your account</h2>
        @if (error()) { <p class="alert" role="alert">{{ error() }}</p> }

        <div class="grid">
          <label>Username
            <input formControlName="username" autocomplete="username" />
            @if (show('username')) { <small class="err">3-20 letters, numbers or _</small> }
          </label>
          <label>Full name
            <input formControlName="name" autocomplete="name" />
            @if (show('name')) { <small class="err">Name is required</small> }
          </label>
          <label>Email
            <input type="email" formControlName="email" autocomplete="email" />
            @if (show('email')) { <small class="err">Enter a valid email</small> }
          </label>
          <label>Profile picture
            <input type="file" accept="image/*" (change)="onFile($event)" />
            @if (picture()) { <img class="preview" [src]="picture()" alt="Preview" /> }
          </label>
          <label>Password
            <input type="password" formControlName="password" autocomplete="new-password" />
            @if (show('password')) { <small class="err">At least 6 characters</small> }
          </label>
          <label>Confirm password
            <input type="password" formControlName="confirm" autocomplete="new-password" />
            @if (form.touched && form.errors?.['mismatch']) { <small class="err">Passwords do not match</small> }
          </label>
          <label>Card holder
            <input formControlName="cardHolder" autocomplete="cc-name" />
            @if (show('cardHolder')) { <small class="err">Required</small> }
          </label>
          <label>Credit card number
            <input formControlName="cardNumber" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" />
            @if (show('cardNumber')) { <small class="err">Enter a valid card number</small> }
            <small class="muted">Only the last 4 digits are kept.</small>
          </label>
        </div>

        <fieldset>
          <legend>Preferences</legend>
          <label>Favourite category
            <select formControlName="favoriteCategory">
              <option value="tools">Kitchen tools</option>
              <option value="spices">Spices</option>
              <option value="ready-meals">Ready meals</option>
              <option value="uniforms">Uniforms</option>
              <option value="knife-kits">Knife kits</option>
            </select>
          </label>
          <label class="check"><input type="checkbox" formControlName="newsletter" /> Send me the newsletter</label>
          <label class="check"><input type="checkbox" formControlName="dark" /> Dark theme</label>
        </fieldset>

        <button class="btn btn-primary" [disabled]="busy()">{{ busy() ? 'Creating…' : 'Sign up' }}</button>
        <p class="muted">Already registered? <a routerLink="/login">Login</a></p>
      </form>
    </section>
  `,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  busy = signal(false);
  picture = signal('');

  form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.pattern(/^\w{3,20}$/)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
      cardHolder: ['', Validators.required],
      cardNumber: ['', [Validators.required, luhn]],
      favoriteCategory: ['spices' as 'tools' | 'spices' | 'ready-meals' | 'uniforms' | 'knife-kits'],
      newsletter: [false],
      dark: [false],
    },
    { validators: matchPasswords },
  );

  show(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  onFile(ev: Event): void {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) { this.error.set('Picture must be under 300 KB (localStorage is small).'); return; }
    const reader = new FileReader();
    reader.onload = () => this.picture.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.busy.set(true);
    const v = this.form.getRawValue();
    const res = await this.auth.signup({
      username: v.username, name: v.name, email: v.email, password: v.password,
      picture: this.picture(), cardNumber: v.cardNumber, cardHolder: v.cardHolder,
      preferences: { theme: v.dark ? 'dark' : 'light', newsletter: v.newsletter, favoriteCategory: v.favoriteCategory },
    });
    this.busy.set(false);
    if (!res.ok) { this.error.set(res.error ?? 'Signup failed.'); return; }
    await this.router.navigate(['/login']);
  }
}
