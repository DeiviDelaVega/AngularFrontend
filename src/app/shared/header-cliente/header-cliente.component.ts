// src/app/shared/header-cliente/header-cliente.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header-cliente',
  imports: [RouterLink],
  template: `
    <nav class="navbar navbar-dark bg-dark px-3">
      <a class="navbar-brand" routerLink="/cliente">Cliente</a>
      <div class="ms-auto">
        <a class="btn btn-sm btn-outline-light" routerLink="/auth/login" (click)="logout()">Salir</a>
      </div>
    </nav>
  `
})
export class HeaderClienteComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }
}
