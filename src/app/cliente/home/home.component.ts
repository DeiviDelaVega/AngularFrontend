// src/app/cliente/home/home.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderClienteComponent } from '../../shared/header-cliente/header-cliente.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, HeaderClienteComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  encapsulation: ViewEncapsulation.None 
})

export class HomeClienteComponent {
  nombre = '';
  apellido = '';
  // Slider 
  pos = 1;
  imagenActual = 'assets/imagenes/banner1.jpg';
  opacidad = 1;

  constructor(private http: HttpClient) {
    this.http.get<any>(`${environment.api}/cliente/me`)
      .subscribe(r => {
        this.nombre = r.nombre;
        this.apellido = r.apellido;
      });
    // si más adelante el backend envía "modalSancion" y "alerta" por algún endpoint, aquí disparas el Swal:
    // if (modalSancion) Swal.fire({ icon:'warning', title:'Cuenta sancionada', text: alerta });

    // Inicia rotación
    setTimeout(() => this.bajarOpacidad(), 1000);
  }

  rotacion() {
    this.pos++;
    if (this.pos > 4) this.pos = 1;
    this.imagenActual = `assets/imagenes/banner${this.pos}.jpg`;
    this.opacidad = 1;
    setTimeout(() => this.bajarOpacidad(), 1000);
  }

  bajarOpacidad() {
    this.opacidad = 0.6;
    setTimeout(() => this.rotacion(), 1000);
  }
}