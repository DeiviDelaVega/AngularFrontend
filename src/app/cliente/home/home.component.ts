// src/app/cliente/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderClienteComponent } from '../../shared/header-cliente/header-cliente.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, HeaderClienteComponent],
  templateUrl: './home.html'
})
export class HomeClienteComponent {
  nombre = '';
  constructor(private http: HttpClient) {
    this.http.get<any>(`${environment.api}/cliente/me`).subscribe(r => this.nombre = r.nombre);
    // si más adelante el backend envía "modalSancion" y "alerta" por algún endpoint, aquí disparas el Swal:
    // if (modalSancion) Swal.fire({ icon:'warning', title:'Cuenta sancionada', text: alerta });
  }
}
