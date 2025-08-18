// src/app/shared/header-cliente/header-cliente.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header-cliente',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './header-cliente.scss',
  template: `
    <nav class="navbar navbar-expand-md navbar-dark custom-navbar px-4 py-3">
      <a class="navbar-brand d-flex align-items-center" routerLink="/">
        <img src="assets/imagenes/nav_image.png" alt="Logo" width="40" height="40">
        <div>
          <span>Web de Reservas</span>
          <small>Monterrico Polo</small>
        </div>
      </a>

      <button
        class="navbar-toggler border-0"
        type="button"
        (click)="toggleNavbar()"
        [attr.aria-expanded]="!isNavbarCollapsed"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div 
        class="collapse navbar-collapse" 
        [class.show]="!isNavbarCollapsed" 
        id="navbarNavAltMarkup"
      >
        <ul class="navbar-nav ms-auto gap-3 align-items-center">
          
          <li class="nav-item">
            <a
              class="nav-link custom-nav-link"
              routerLink="/cliente"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeNavbar()"
            >
              Inicio
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link custom-nav-link"
              routerLink="/cliente/catalogo/verInmueble"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeNavbar()"
            >
              Inmuebles Disponibles
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link custom-nav-link"
              routerLink="/cliente/misreservas/misReservas"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeNavbar()"
            >
              Mis Reservas
            </a>
          </li>

          <li class="nav-item d-flex align-items-center justify-content-center">
            <form (submit)="logout()">
              <button class="btn btn-danger btn-sm" type="submit">Cerrar sesión</button>
            </form>
          </li>
        </ul>
      </div>
    </nav>
  `
})
export class HeaderClienteComponent {
  constructor(private router: Router) {}

  isNavbarCollapsed = true;
  isDropdownOpen = false;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    if (this.isNavbarCollapsed) {
      this.isDropdownOpen = false;
    }
  }

  closeNavbar() {
    this.isNavbarCollapsed = true;
    this.isDropdownOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.setItem('logoutMessage', 'Sesión cerrada correctamente');
    this.router.navigateByUrl('/auth/login');
  }
}