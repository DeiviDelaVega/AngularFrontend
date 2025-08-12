import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header-admin',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './header-admin.scss',
  template: `
    <nav class="navbar navbar-expand-md navbar-dark custom-navbar px-4 py-3">
      <a class="navbar-brand fw-bold text-white" routerLink="/admin">Web de Reservas</a>

      <!-- Botón hamburguesa -->
      <button
        class="navbar-toggler border-0"
        type="button"
        (click)="toggleNavbar()"
        [attr.aria-expanded]="!isNavbarCollapsed"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú colapsable -->
      <div
        class="collapse navbar-collapse"
        [class.show]="!isNavbarCollapsed"
        id="navbarNavAltMarkup"
      >
        <ul class="navbar-nav ms-auto gap-3 align-items-center">

          <li class="nav-item">
            <a
              class="nav-link custom-nav-link"
              routerLink="/admin"
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
              routerLink="/admin/cliente"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeNavbar()"
            >
              Clientes
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link custom-nav-link"
              routerLink="/admin/inmuebles"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeNavbar()"
            >
              Inmuebles
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link custom-nav-link"
              routerLink="/admin/reservas"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeNavbar()"
            >
              Reservas
            </a>
          </li>

          <!-- Dropdown -->
          <li class="nav-item dropdown" [class.show]="isDropdownOpen">
            <a
              class="nav-link dropdown-toggle custom-nav-link"
              href="#"
              role="button"
              [attr.aria-expanded]="isDropdownOpen"
              (click)="toggleDropdown($event)"
            >
              Reportes
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" [class.show]="isDropdownOpen">
              <li>
                <a
                  class="dropdown-item"
                  routerLink="/admin/reportes/InmueblesMasReservados"
                  (click)="closeNavbar()"
                >
                  Inmuebles más reservados
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  routerLink="/admin/reportes/ClientesMasReservas"
                  (click)="closeNavbar()"
                >
                  Clientes con más reservas
                </a>
              </li>
            </ul>
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
export class HeaderAdmin {
  constructor(private router: Router) {}

  isNavbarCollapsed = true;
  isDropdownOpen = false;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    if (this.isNavbarCollapsed) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.preventDefault(); 
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeNavbar() {
    this.isNavbarCollapsed = true;
    this.isDropdownOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }
}