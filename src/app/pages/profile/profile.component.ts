import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_ACCESS, ROLE_LABELS } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (auth.user(); as u) {
      <section class="form-page">
        <div class="panel wide">
          <header class="profile-head">
            @if (u.picture) { <img class="big-avatar" [src]="u.picture" alt="Profile picture" /> }
            @else { <span class="big-avatar">{{ u.name[0] }}</span> }
            <div>
              <h2>{{ u.name }}</h2>
              <p class="muted">&#64;{{ u.username }} · <strong>{{ roles[u.role] }}</strong></p>
            </div>
          </header>

          <dl class="details">
            <dt>Email</dt><dd>{{ u.email }}</dd>
            <dt>Card</dt><dd>•••• •••• •••• {{ u.cardLast4 }} ({{ u.cardHolder }})</dd>
            <dt>Favourite category</dt><dd>{{ u.preferences.favoriteCategory }}</dd>
            <dt>Newsletter</dt><dd>{{ u.preferences.newsletter ? 'Yes' : 'No' }}</dd>
            <dt>Theme</dt><dd>{{ u.preferences.theme }}</dd>
            <dt>You can access</dt><dd>{{ access[u.role].join(', ') }}</dd>
          </dl>

          @if (!editing()) {
            <button class="btn btn-outline" (click)="startEdit()">Edit profile</button>
          } @else {
            <form [formGroup]="form" (ngSubmit)="save()" class="grid">
              <label>Name <input formControlName="name" /></label>
              <label>Email <input type="email" formControlName="email" /></label>
              <label>Favourite category
                <select formControlName="favoriteCategory">
                  <option value="tools">Kitchen tools</option><option value="spices">Spices</option>
                  <option value="ready-meals">Ready meals</option><option value="uniforms">Uniforms</option>
                  <option value="knife-kits">Knife kits</option>
                </select>
              </label>
              <label class="check"><input type="checkbox" formControlName="newsletter" /> Newsletter</label>
              <div class="actions">
                <button class="btn btn-primary" [disabled]="form.invalid">Save</button>
                <button type="button" class="btn btn-ghost" (click)="editing.set(false)">Cancel</button>
              </div>
            </form>
          }
          @if (saved()) { <p class="ok">Profile updated ✔</p> }
        </div>
      </section>
    }
  `,
})
export class ProfileComponent {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  roles = ROLE_LABELS;
  access = ROLE_ACCESS;
  editing = signal(false);
  saved = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    favoriteCategory: ['spices' as 'tools' | 'spices' | 'ready-meals' | 'uniforms' | 'knife-kits'],
    newsletter: [false],
  });

  startEdit(): void {
    const u = this.auth.user()!;
    this.form.setValue({
      name: u.name, email: u.email,
      favoriteCategory: u.preferences.favoriteCategory, newsletter: u.preferences.newsletter,
    });
    this.saved.set(false);
    this.editing.set(true);
  }

  save(): void {
    const u = this.auth.user()!;
    const v = this.form.getRawValue();
    this.auth.updateProfile({
      name: v.name, email: v.email,
      preferences: { ...u.preferences, favoriteCategory: v.favoriteCategory, newsletter: v.newsletter },
    });
    this.editing.set(false);
    this.saved.set(true);
  }
}
