import { HeaderAdmin } from "../../../shared/header-admin/header-admin";
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from "../../../../environments/environment";
declare const google: any;

@Component({
  selector: 'app-edit-inmueble',
  standalone: true,
  imports: [HeaderAdmin, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-inmueble.component.html',
  styleUrl: './edit-inmueble.component.scss'
})
export class EditInmuebleComponent implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  router = inject(Router);

  inmuebleId!: number;
  imagenUrl: string | null = null;
  imagenActual: string | null = null;
  selectedFile: File | null = null;
  latitud: number | null = null;
  longitud: number | null = null;
  nombreArchivoNuevo: string | null = null;
  googleMapsLoaded = false;
  coordenadasListas = false;

  form = this.fb.group({
    nombre: ['', Validators.required],
    capacidad: ['', Validators.required],
    numeroHabitaciones: ['', Validators.required],
    precioPorNoche: ['', Validators.required],
    descripcion: [''],
    serviciosIncluidos: [''],
    disponibilidad: ['', Validators.required],
    latitud: [''],
    longitud: ['']
  });

  ngOnInit() {
    this.inmuebleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.inmuebleId) {
      this.cargarInmueble();
    }
    (window as any).initMap = () => {
    this.googleMapsLoaded = true;
      this.verificarYMostrarMapa();
    };
    this.cargarGoogleMapsScript();
  }

  cargarInmueble() {
    this.http.get<any>(`${environment.api}/admin/inmuebles/detalle/${this.inmuebleId}`)
      .subscribe(data => {
        this.form.patchValue({
          nombre: data.nombre,
          capacidad: data.capacidad,
          numeroHabitaciones: data.numeroHabitaciones,
          precioPorNoche: data.precioPorNoche,
          descripcion: data.descripcion,
          serviciosIncluidos: data.serviciosIncluidos,
          disponibilidad: data.disponibilidad,
          latitud: data.latitud,
          longitud: data.longitud
        });

        // Actualizar variables del componente para el template
        this.latitud = data.latitud;
        this.longitud = data.longitud;

        this.imagenActual = data.imagenHabitacion;

        this.coordenadasListas = !!(data.latitud !== null && data.longitud !== null);
        this.verificarYMostrarMapa();
      });
  }

  cargarGoogleMapsScript() {
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCc1pV5K0s9Z7xGUUU03n6zBhKemKLiRx8&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      this.googleMapsLoaded = true;
      this.verificarYMostrarMapa();
    }
  }

  verificarYMostrarMapa() {
    if (this.googleMapsLoaded && this.coordenadasListas) {
      // Esperar un momento para que Angular haya renderizado el div #map
      setTimeout(() => this.initMap(), 100);
    }
  }

  initMap() {
    const lat = Number(this.form.value.latitud);
    const lng = Number(this.form.value.longitud);
    if (!lat || !lng) return;

    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    const map = new google.maps.Map(mapDiv, {
      zoom: 15,
      center: { lat, lng }
    });

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
      title: this.form.value.nombre || ''
    });

    marker.addListener("dragend", (event: any) => {
      this.form.patchValue({
        latitud: event.latLng.lat(),
        longitud: event.latLng.lng()
      });
    });

    // Forzar resize para evitar mapa en blanco
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat, lng });
    }, 200);
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.selectedFile = file;
      this.nombreArchivoNuevo = file.name;
    } else {
      this.selectedFile = null;
      this.nombreArchivoNuevo = null;
    }
  }

  confirmarActualizacion() {
    Swal.fire({
      title: '¿Estás seguro de actualizar el inmueble?',
      text: "Esta acción será permanente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarInmueble();
      }
    });
  }

  actualizarInmueble() {
    const formData = new FormData();

    const dto = {
      nombre: this.form.value.nombre || '',
      capacidad: this.form.value.capacidad || 0,
      numeroHabitaciones: this.form.value.numeroHabitaciones || 0,
      descripcion: this.form.value.descripcion || '',
      serviciosIncluidos: this.form.value.serviciosIncluidos || '',
      disponibilidad: this.form.value.disponibilidad || 'No',
      precioPorNoche: this.form.value.precioPorNoche || 0,
      latitud: this.form.value.latitud || 0,
      longitud: this.form.value.longitud || 0
    };

    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.put(`${environment.api}/admin/inmuebles/editar/${this.inmuebleId}`, formData)
    .subscribe({
      next: () => {
        Swal.fire({
          title: '¡Actualizado!',
          text: 'El inmueble se actualizó correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => this.router.navigate(['/admin/inmuebles']));
      },
      error: () => {
        Swal.fire('Error', 'Hubo un problema al actualizar', 'error');
      }
    });
  }
}