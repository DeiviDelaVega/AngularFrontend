// src/app/core/guest-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    // Ya está logueado, lo mandamos a su dashboard
    router.navigateByUrl(role === 'ROLE_admin' ? '/admin' : '/cliente');
    return false;
  }
  return true; // Puede entrar si no está logueado
};
