import { Router, RouterModule } from '@angular/router';
import { Component, ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderAdmin } from "../../shared/header-admin/header-admin";

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterModule, CommonModule, HeaderAdmin],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None 
})

export class Home {
  nombre = '';
  apellido = '';

  // Slider 
  pos = 1;
  imagenActual = 'assets/imagenes/baner1.jpg';
  opacidad = 1;
  
  constructor(private http: HttpClient) {
    this.http.get<any>(`${environment.api}/admin/me`)
      .subscribe(r => {
        this.nombre = r.nombre;
        this.apellido = r.apellido;
      });
    // Inicia rotación
    setTimeout(() => this.bajarOpacidad(), 1000);
  }

  rotacion() {
    this.pos++;
    if (this.pos > 4) this.pos = 1;
    this.imagenActual = `assets/imagenes/baner${this.pos}.jpg`;
    this.opacidad = 1;
    setTimeout(() => this.bajarOpacidad(), 1000);
  }

  bajarOpacidad() {
    this.opacidad = 0.6;
    setTimeout(() => this.rotacion(), 1000);
  }
}