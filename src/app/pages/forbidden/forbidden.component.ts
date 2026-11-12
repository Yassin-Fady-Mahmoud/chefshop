import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="form-page">
      <div class="panel">
        <h2>⛔ Access denied</h2>
        <p>Your role is not allowed to open this page.</p>
        <a routerLink="/" class="btn btn-primary">Back to home</a>
      </div>
    </section>
  `,
})
export class ForbiddenComponent {}
