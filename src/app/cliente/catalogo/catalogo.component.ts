import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderClienteComponent } from '../../shared/header-cliente/header-cliente.component';
import { HttpClientModule } from '@angular/common/http';
import { MotivoSancionComponent } from '../motivo-sancion.component/motivo-sancion.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ CommonModule, FormsModule,RouterModule, HttpClientModule, DecimalPipe, HeaderClienteComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss' ]
})
export class CatalogoComponent implements OnInit {

  inmuebles: any[] = [];
  alerta: string = '⚠️ Recuerda revisar los motivos de sanción antes de reservar.';
  mostrarFiltros: boolean = false;
  modalSancion: boolean = false;
  motivoSancion: string = '';

  filtro: string = '';
  precioDesde: number | null = null;
  precioHasta: number | null = null;
  fechaDesde: string = '';
  fechaHasta: string = '';
  estado: string = '';

  page: number = 0;
  totalPaginas: number = 0;

  private API_URL = `${environment.api}/cliente/catalogo`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.buscar();
  }

 buscar(): void {
    let params = new HttpParams()
    .set('page', this.page.toString())
    .set('filtro', this.filtro || '');

    if (this.precioDesde != null) params = params.set('precioDesde', this.precioDesde.toString());
    if (this.precioHasta != null) params = params.set('precioHasta', this.precioHasta.toString());
    if (this.fechaDesde) params = params.set('fechaDesde', this.fechaDesde);
    if (this.fechaHasta) params = params.set('fechaHasta', this.fechaHasta);
    if (this.estado) params = params.set('estado', this.estado);

    this.alerta = ''; // Limpiar la alerta antes de hacer la búsqueda
    const token = localStorage.getItem('token');

    this.http.get<any>(`${this.API_URL}/verInmueble`, { 
  params,
  headers: { Authorization: `Bearer ${token}` },
  withCredentials: true
})
.subscribe({
    next: (data) => {
      console.log('Respuesta completa del backend:', data);
      this.inmuebles = data.inmuebles || [];
      console.log('Inmuebles asignados: ', this.inmuebles);
      this.totalPaginas = data.totalPaginas || 0;
      this.alerta = data.alerta || '';
      this.modalSancion = data.modalSancion || false;
      this.motivoSancion = data.motivo || '';
    },
    error: (err) => {
      console.error('Error al buscar inmuebles', err);
      // Aquí manejas el error del backend y lo muestras al usuario
      this.inmuebles = []; // Asegurarse de que la lista de inmuebles esté vacía
      if (err.status === 404) {
        this.alerta = 'No se encontró el servicio. Revise la URL de la API.';
      } else if (err.status === 401) {
        this.alerta = 'No está autorizado para ver esta información.';
      } else {
        this.alerta = 'Ocurrió un error inesperado al cargar los inmuebles.';
      }
    }
  });
}

  limpiar(): void {
    this.filtro = '';
    this.precioDesde = null;
    this.precioHasta = null;
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.estado = '';
    this.page = 0;
    this.buscar();
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  cambiarPagina(pagina: number):void{
    if(pagina >=0  && pagina < this.totalPaginas){
      this.page = pagina;
      this.buscar();
    }
  }

}
