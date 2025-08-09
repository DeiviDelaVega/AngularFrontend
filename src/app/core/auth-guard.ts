// src/app/core/auth.guard.ts
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (): boolean|UrlTree => {
  const ok = !!localStorage.getItem('token');
  return ok ? true : inject(Router).createUrlTree(['/auth/login']);
};
