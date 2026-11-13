import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'store',
    loadChildren: () => import('./store/store.routes').then(m => m.STORE_ROUTES),
  },
];