import { Component, OnInit, inject, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderAdmin } from "../../../shared/header-admin/header-admin";

declare const google: any;

declare global {
  interface Window {
    initMap: () => void;
  }
}

@Component({
  selector: 'app-detail-inmueble',
  standalone: true,
  imports: [HeaderAdmin, CommonModule, RouterModule],
  templateUrl: './detail-inmueble.component.html',
  styleUrl: './detail-inmueble.component.scss'
})
export class DetailInmuebleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  public router = inject(Router);
  private ngZone = inject(NgZone);
  inmueble: any;
  loading = true;
  error = '';
  map: any;

  private static googleMapsLoaded = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get(`http://localhost:8080/api/admin/inmuebles/detalle/${id}`).subscribe({
      next: (data) => {
        this.inmueble = data;
        this.loading = false;
        // Solo carga mapa si hay lat y lng
        if (this.inmueble.latitud && this.inmueble.longitud) {
          this.loadGoogleMaps();
        }
      },
      error: (err) => {
        console.error('Error al cargar inmueble:', err);
        this.error = 'No se encontró el inmueble';
        this.loading = false;
      }
    });
  }
  
  loadGoogleMaps() {
    if (typeof google !== 'undefined' && google.maps) {
      setTimeout(() => this.initMap(), 0); // Espera a que Angular renderice el DOM
      return;
    }

    if (DetailInmuebleComponent.googleMapsLoaded) {
      setTimeout(() => this.initMap(), 0);
      return;
    }
    DetailInmuebleComponent.googleMapsLoaded = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCc1pV5K0s9Z7xGUUU03n6zBhKemKLiRx8&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      this.ngZone.run(() => {
        setTimeout(() => this.initMap(), 0);
      });
    };

    document.body.appendChild(script);
  }

  initMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    const latLng = { lat: this.inmueble.latitud, lng: this.inmueble.longitud };

    this.map = new google.maps.Map(mapDiv, {
      center: latLng,
      zoom: 15
    });

    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: this.inmueble.nombre
    });

    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setCenter(latLng);
    }, 200);
  }
}
