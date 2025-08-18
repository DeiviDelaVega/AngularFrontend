// src/app/core/role.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route) => {
  const allowed = route.data?.['roles'] as string[];
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<any>(`${environment.api}/auth/me`).pipe(
    map(me => allowed.includes(me.role)),
    tap(ok => { if (!ok) router.navigateByUrl('/auth/login'); })
  );
};
