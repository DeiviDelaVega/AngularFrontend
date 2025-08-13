// src/app/core/role.guard.ts
// src/app/core/role-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';

function decodeJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function normalizeRole(role: string | null | undefined): string | null {
  if (!role) return null;
  return role.startsWith('ROLE_') ? role : `ROLE_${role}`;
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const allowedRoles: string[] = route.data?.['roles'] ?? []; // ej: ['ROLE_admin']

  const token = localStorage.getItem('token');
  if (!token) return router.parseUrl('/auth/login');

  // Expiración del token
  const payload = decodeJwt(token);
  const exp = payload?.exp ? Number(payload.exp) : null; // segundos epoch
  const nowSec = Math.floor(Date.now() / 1000);
  if (!exp || exp <= nowSec) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    return router.parseUrl('/auth/login');
  }

  // Tomar rol de localStorage si está, si no desde authorities del token
  let role = localStorage.getItem('role');
  if (!role) {
    const authorities: string[] = payload?.authorities ?? [];
    // toma el primero si hay varios; ajusta si manejas multi-rol
    role = authorities[0] ?? null;
  }

  const normalized = normalizeRole(role);
  const allowedNormalized = allowedRoles.map(normalizeRole);

  if (normalized && allowedNormalized.includes(normalized)) {
    return true;
  }

  // Redirección por defecto según rol actual (si existe)
  if (normalized === 'ROLE_admin') return router.parseUrl('/admin');
  if (normalized === 'ROLE_cliente') return router.parseUrl('/cliente');
  return router.parseUrl('/auth/login');
};
