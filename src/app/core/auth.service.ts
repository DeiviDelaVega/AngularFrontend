// src/app/core/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse { token: string; role: string; email: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.api;
  constructor(private http: HttpClient) {}
  // src/app/core/auth.service.ts
login(dto: { email: string; password: string; captcha?: string }) {
  return this.http.post<LoginResponse>(`${this.api}/auth/login`, dto)
    .pipe(tap(r => {
      localStorage.setItem('token', r.token);
      localStorage.setItem('role', r.role);   // 👈 guardamos el rol
      localStorage.setItem('email', r.email); // 👈 opcional
    }));
}

  registroCliente(dto: any) { return this.http.post<void>(`${this.api}/auth/registro/cliente`, dto); }
  registroAdmin(dto: any)   { return this.http.post<void>(`${this.api}/auth/registro/admin`, dto); }
  me() { return this.http.get<any>(`${this.api}/auth/me`); }
  logout(){ localStorage.removeItem('token'); }
}
