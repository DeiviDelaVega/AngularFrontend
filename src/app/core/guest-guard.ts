// src/app/core/guest-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  let role = localStorage.getItem('role');

  if (token) {
    if (role && !role.startsWith('ROLE_')) role = `ROLE_${role}`;
    router.navigateByUrl(role === 'ROLE_admin' ? '/admin' : '/cliente');
    return false;
  }
  return true;
};
