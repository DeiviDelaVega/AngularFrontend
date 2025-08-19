import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagina-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagina-inicio.component.html',
  styleUrl: './pagina-inicio.component.scss'
})
export class PaginaInicioComponent {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.setItem('logoutMessage', 'Sesión cerrada correctamente');
    this.router.navigateByUrl('/auth/login');
  }

  continuarNavegando() {
    const role = this.getRole();
    if (role === 'ROLE_admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'ROLE_cliente') {
      this.router.navigate(['/cliente']);
    } else {
      this.router.navigate(['/']);
    }
  }
}