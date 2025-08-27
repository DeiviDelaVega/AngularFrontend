import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
  <div class="container text-center mt-5">
    <h2 class="text-danger">Pago cancelado</h2>
    <p>No se pudo completar el pago. Intenta nuevamente.</p>
    <a routerLink="/cliente/catalogo/verInmueble" class="btn btn-secondary mt-3">Volver al catálogo</a>
  </div>`
})
export class PagoErrorComponent {}
