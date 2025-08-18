import { RouterModule } from '@angular/router';
import { AfterViewInit, Component, NgZone, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { HeaderAdmin } from "../../../shared/header-admin/header-admin";
import { Router } from '@angular/router';

declare const google: any; // Para que TypeScript no marque error

@Component({
  selector: 'app-create-inmueble',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, HeaderAdmin],
  templateUrl: './create-inmueble.component.html',
  styleUrls: ['./create-inmueble.component.scss']
})
export class CreateInmuebleComponent implements OnInit, AfterViewInit {
  private fb = inject(UntypedFormBuilder);
  private http = inject(HttpClient);
  private ngZone = inject(NgZone);
  constructor(private router: Router) {}
  
  form = this.fb.group({
    id: [0],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    capacidad: [1, [Validators.required, Validators.min(1)]],
    numeroHabitaciones: [1, [Validators.required, Validators.min(1)]],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    serviciosIncluidos: ['', [Validators.required, Validators.maxLength(200)]],
    disponibilidad: ['Si', Validators.required],
    precioPorNoche: [0.01, [Validators.required, Validators.min(0.01)]],
    administradorId: [null, Validators.required],
    latitud: [null, Validators.required],
    longitud: [null, Validators.required]
  });

  file?: File;
  imagenPreview?: string | ArrayBuffer | null;
  maxFileMB = 10;
  map: any;
  marker: any;

  ngOnInit() {
    const administradorId = Number(localStorage.getItem('adminId'));
    if (administradorId) {
      this.form.patchValue({ administradorId });
    }

    window.addEventListener('map:click', (event: any) => {
      this.ngZone.run(() => {
        const { lat, lng } = event.detail;
        this.form.patchValue({
          latitud: lat,
          longitud: lng
        });
        this.form.get('latitud')?.markAsTouched();
        this.form.get('longitud')?.markAsTouched();
      });
    });
  }

  ngAfterViewInit(): void {
    this.loadGoogleMaps().then(() => {
      this.initMap();
    });
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCc1pV5K0s9Z7xGUUU03n6zBhKemKLiRx8&callback=initMap';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  initMap(): void {
    const centro = { lat: -12.0464, lng: -77.0428 };
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    this.map = new google.maps.Map(mapDiv, { zoom: 12, center: centro });

    this.map.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      this.setLocation(lat, lng);
      if (this.marker) {
        this.marker.setPosition(e.latLng);
      } else {
        this.marker = new google.maps.Marker({ position: e.latLng, map: this.map });
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.file = undefined;
      this.imagenPreview = null;
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      Swal.fire('Error', 'Solo se permiten imágenes JPG, PNG, GIF o WEBP.', 'error');
      input.value = '';
      return;
    }
    if (file.size > this.maxFileMB * 1024 * 1024) {
      Swal.fire('Error', `La imagen no debe superar los ${this.maxFileMB} MB.`, 'error');
      input.value = '';
      return;
    }
    this.file = file;
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview = reader.result;
    reader.readAsDataURL(file);
  }

  setLocation(lat: number, lng: number) {
    this.ngZone.run(() => {
      this.form.patchValue({ latitud: lat, longitud: lng });
      this.form.get('latitud')?.markAsTouched();
      this.form.get('longitud')?.markAsTouched();
    });
  }

  validarForm(): boolean {
    if ((this.form.value.id === 0 || this.form.value.id === null) && !this.file) {
      Swal.fire('Error', 'Debes seleccionar una imagen para crear el inmueble', 'error');
      return false;
    }
    return true;
  }

  enviar() {
    if (!this.validarForm()) return;

    Swal.fire({
      title: '¿Estás seguro de registrar este inmueble?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const formData = new FormData();
        const v = this.form.value;
        if (v.id !== undefined && v.id !== null) formData.append('id', v.id);
        formData.append('nombre', v.nombre);
        formData.append('capacidad', String(v.capacidad));
        formData.append('numeroHabitaciones', String(v.numeroHabitaciones));
        formData.append('descripcion', v.descripcion);
        formData.append('serviciosIncluidos', v.serviciosIncluidos);
        formData.append('disponibilidad', v.disponibilidad);
        formData.append('precioPorNoche', String(v.precioPorNoche));
        if (v.administradorId) formData.append('administrador.id', String(v.administradorId));
        formData.append('latitud', String(v.latitud));
        formData.append('longitud', String(v.longitud));

        if (this.file) {
          formData.append('file', this.file, this.file.name);
        }

        this.http.post('http://localhost:8080/api/admin/inmuebles/guardar', formData).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Agregado!',
              text: 'El inmueble se registró correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(res => {
              if (res.isConfirmed) {
                this.router.navigate(['/admin/inmuebles']);
              }
            });

            // Reseteo y limpieza
            this.form.reset({
              id: 0,
              disponibilidad: 'Si',
              capacidad: 1,
              numeroHabitaciones: 1,
              precioPorNoche: 0.01
            });
            this.imagenPreview = null;
            window.dispatchEvent(new CustomEvent('map:clear'));
          },
          error: err => {
            let msg = 'Ocurrió un error al guardar';
            if (err?.error) msg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
            Swal.fire('Error', msg, 'error');
          }
        });
      }
    });
  }
}