import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../models/user.model';
import { AuthService } from '../services/auth.service';

/** Must be logged in, otherwise go to /login and remember where we wanted to go. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Usage in routes:  canActivate: [roleGuard], data: { roles: ['admin', 'accountant'] } */
export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  const allowed = (route.data['roles'] as Role[] | undefined) ?? [];
  return allowed.length === 0 || auth.hasRole(...allowed) ? true : router.createUrlTree(['/forbidden']);
};

/** Keep logged-in users away from login/signup. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? inject(Router).createUrlTree(['/profile']) : true;
};
