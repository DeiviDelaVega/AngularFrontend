// src/app/core/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse { token: string; role: string; email: string; }
export interface Perfil { nombre: string; apellido: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.api;
  constructor(private http: HttpClient) {}
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
getPerfil() {
  let role = localStorage.getItem('role') ?? '';
  if (role && !role.startsWith('ROLE_')) role = `ROLE_${role}`;
  const path = role === 'ROLE_admin' ? '/admin/me' : '/cliente/me';
  return this.http.get<Perfil>(`${this.api}${path}`);
}
  logout(){ localStorage.removeItem('token'); }
}
