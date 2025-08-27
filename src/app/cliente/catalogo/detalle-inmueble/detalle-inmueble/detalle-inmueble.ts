import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

declare global {
  interface Window { initGMap: () => void; google: any; }
}

@Component({
  standalone: true,
  selector: 'app-detalle-inmueble',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detalle-inmueble.html',
  styleUrls: ['./detalle-inmueble.scss']
})
export class DetalleInmuebleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http  = inject(HttpClient);
  private router = inject(Router);

  id!: number;
  inmueble: any;
  precioPorNoche = 0;
  fechasOcupadas: string[] = [];
  entrada = ''; salida = ''; total = 0; acepto = false;

  private salidaPicker!: FlatpickrInstance;

  private CATALOGO_URL = `${environment.api}/cliente/catalogo`;
  private PAGO_URL     = `${environment.api}/pago`;

  // Esperar a que lleguen ambos requests
  private loadedDetalle = false;
  private loadedFechas  = false;

  // Mapa
  hasCoords = false;
  private static mapsReady?: Promise<void>;

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('token') || '';

    // Detalle
    this.http.get<any>(`${this.CATALOGO_URL}/detalle/${this.id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: res => {
        this.inmueble = res;
        this.precioPorNoche = Number(res?.precioPorNoche ?? res?.precio_Por_Noche ?? 0);

        // coordenadas disponibles?
        this.hasCoords = !!(res?.latitud && res?.longitud);

        this.loadedDetalle = true;
        this.tryInitPickers();
        this.tryInitMap(); // ← intenta dibujar el mapa
      },
      error: _ => Swal.fire('Error', 'No se pudo cargar el inmueble.', 'error')
    });

    // Fechas ocupadas
    this.http.get<string[]>(`${this.CATALOGO_URL}/ocupadas/${this.id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: fechas => {
        this.fechasOcupadas = fechas || [];
        this.loadedFechas = true;
        this.tryInitPickers();
      },
      error: _ => {
        this.loadedFechas = true; // permitir reservar aunque falle
        this.tryInitPickers();
      }
    });
  }

  /** Inicializa flatpickr sólo cuando ya hay DOM + data */
  private tryInitPickers() {
    if (!this.loadedDetalle || !this.loadedFechas) return;
    setTimeout(() => this.initPickers(), 0);
  }

  private initPickers() {
    const salidaEl  = document.getElementById('salida')  as HTMLInputElement | null;
    const entradaEl = document.getElementById('entrada') as HTMLInputElement | null;
    if (!salidaEl || !entradaEl) return;

    this.salidaPicker = flatpickr(salidaEl, {
      minDate: 'today',
      dateFormat: 'Y-m-d',
      disable: this.fechasOcupadas,
      onChange: () => this.calcular(),
      allowInput: false,
      locale: Spanish,
      clickOpens: true,
      // static: true
    }) as unknown as FlatpickrInstance;

    flatpickr(entradaEl, {
      minDate: 'today',
      dateFormat: 'Y-m-d',
      disable: this.fechasOcupadas,
      onChange: (_sd, dateStr) => {
        this.salidaPicker.set('minDate', dateStr);
        this.calcular();
      },
      allowInput: false,
      locale: Spanish,
      clickOpens: true,
      // static: true
    });
  }

  calcular() {
    const e = (document.getElementById('entrada') as HTMLInputElement | null)?.value || '';
    const s = (document.getElementById('salida')  as HTMLInputElement | null)?.value || '';
    this.entrada = e; this.salida = s;

    if (e && s) {
      const d1 = new Date(e);
      const d2 = new Date(s);
      if (d2 > d1) {
        const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
        this.total = diff * this.precioPorNoche;
        return;
      }
    }
    this.total = 0;
  }

  async pagar() {
    if (!this.entrada || !this.salida || this.total <= 0) {
      await Swal.fire('Fechas inválidas', 'Selecciona fechas válidas para continuar.', 'warning');
      return;
    }
    if (!this.acepto) {
      await Swal.fire('Términos no aceptados', 'Debes aceptar los Términos y Condiciones.', 'warning');
      return;
    }

    const token = localStorage.getItem('token') || '';
    const btn = document.activeElement as HTMLButtonElement | null;
    if (btn) { btn.disabled = true; btn.innerText = 'Procesando…'; }

    this.http.post<{url: string}>(`${this.PAGO_URL}/checkout`, {
      fechaInicio: this.entrada,
      fechaFin: this.salida,
      total: Number(this.total.toFixed(2)),
      inmuebleId: this.id
    }, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: ({ url }) => window.location.href = url,
      error: async err => {
        await Swal.fire('Error', 'No se pudo iniciar el pago.', 'error');
        if (btn) { btn.disabled = false; btn.innerText = 'Pagar con tarjeta'; }
        console.error(err);
      }
    });
  }

  /** --- MAPA --- */
  private async tryInitMap() {
    if (!this.hasCoords) return;

    // Esperar a que exista el div#map
    await this.waitForMapElement();

    // Esperar a que Google Maps esté listo
    await this.loadGoogleMapsOnce();

    // Dibujar Mapa
    this.renderMap();
  }

  private waitForMapElement(): Promise<void> {
    return new Promise<void>((resolve) => {
      const tryFind = () => {
        const el = document.getElementById('map');
        if (el) resolve();
        else setTimeout(tryFind, 0);
      };
      tryFind();
    });
  }

  private loadGoogleMapsOnce(): Promise<void> {
    if ((window as any).google?.maps) return Promise.resolve();

    if (!DetalleInmuebleComponent.mapsReady) {
      DetalleInmuebleComponent.mapsReady = new Promise<void>((resolve) => {
        const existed = document.getElementById('gmaps-js') as HTMLScriptElement | null;
        if (existed) {
          if ((window as any).google?.maps) resolve();
          else existed.addEventListener('load', () => resolve());
          return;
        }

        const s = document.createElement('script');
        s.id = 'gmaps-js';
        s.async = true;
        s.defer = true;
        s.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCc1pV5K0s9Z7xGUUU03n6zBhKemKLiRx8`;
        s.onload = () => resolve();
        document.body.appendChild(s);
      });
    }

    return DetalleInmuebleComponent.mapsReady;
  }

  private renderMap(retry = 10) {
    const el = document.getElementById('map') as HTMLElement | null;
    if (!el) {
      if (retry > 0) setTimeout(() => this.renderMap(retry - 1), 30);
      return;
    }

    const lat = Number(this.inmueble?.latitud);
    const lng = Number(this.inmueble?.longitud);
    const center = { lat, lng };

    const map = new (window as any).google.maps.Map(el, {
      center,
      zoom: 15,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });

    new (window as any).google.maps.Marker({
      position: center,
      map,
      title: this.inmueble?.nombre || 'Ubicación',
    });

    setTimeout(() => {
      (window as any).google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    }, 0);
  }
}