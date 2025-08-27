import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';        
type Status = 'loading' | 'success' | 'error' | 'already';

@Component({
  standalone: true,
  selector: 'app-pago-exitoso',
    imports: [CommonModule],               // 👈 agrega CommonModule (y RouterModule por el routerLink)
  template: `
  <div class="container text-center mt-5" *ngIf="status === 'loading'">
    <h2 class="text-success">¡Reserva confirmada!</h2>
    <p>Procesando confirmación...</p>
    <div class="spinner-border mt-3" role="status"></div>
    <div class="mt-4">
      <a routerLink="/cliente/catalogo/verInmueble" class="btn btn-outline-secondary">Volver al catálogo</a>
    </div>
  </div>

  <div class="container text-center mt-5" *ngIf="status === 'success'">
    <h2 class="text-success">¡Reserva creada correctamente!</h2>
    <p class="text-muted">Te redirigiremos al catálogo en {{redirectIn}} s…</p>
    <a routerLink="/cliente/catalogo/verInmueble" class="btn btn-primary mt-3">Volver al catálogo ahora</a>
  </div>

  <div class="container text-center mt-5" *ngIf="status === 'already'">
    <h2 class="text-success">Esta reserva ya fue confirmada.</h2>
    <p class="text-muted">No hace falta volver a pagar. Redirigiendo en {{redirectIn}} s…</p>
    <a routerLink="/cliente/catalogo/verInmueble" class="btn btn-primary mt-3">Volver al catálogo</a>
  </div>
  `,
})
export class PagoExitosoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http  = inject(HttpClient);
  private router = inject(Router);
  private PAGO_URL = `${environment.api}/pago`;

  status: Status = 'loading';
  redirectIn = 4;
  private redirectTimer?: any;

  ngOnInit(){
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.router.navigateByUrl('/cliente/pago-error');
      return;
    }

    // Evitar doble creación si recargan la página
    const key = `stripe_session_processed_${sessionId}`;
    if (localStorage.getItem(key)) {
      this.status = 'already';
      this.startRedirectCountdown();
      return;
    }

    const token = localStorage.getItem('token') || '';
    this.http.post(`${this.PAGO_URL}/finalizar?session_id=${sessionId}`, {}, {
      responseType: 'text',
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: _ => {
        localStorage.setItem(key, '1');
        this.status = 'success';
        this.startRedirectCountdown();
      },
      error: _ => this.router.navigateByUrl('/cliente/pago-error')
    });
  }

  private startRedirectCountdown() {
    this.redirectTimer = setInterval(() => {
      this.redirectIn--;
      if (this.redirectIn <= 0) {
        clearInterval(this.redirectTimer);
        this.router.navigateByUrl('/cliente/catalogo/verInmueble');
      }
    }, 1000);
  }
}
