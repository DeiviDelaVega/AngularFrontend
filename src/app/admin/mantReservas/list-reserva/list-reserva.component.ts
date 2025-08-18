import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderAdmin } from "../../../shared/header-admin/header-admin";
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-reserva',
  standalone: true,
  imports: [HeaderAdmin, FormsModule, CommonModule],
  templateUrl: './list-reserva.component.html',
  styleUrl: './list-reserva.component.scss'
})
export class ListReservaComponent implements OnInit {

  reservas: any[] = [];
  currentPage = 0;
  totalPages = 0;
  totalItems = 0;

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  estadoFiltro: string = '';
  
  filtrosVisibles: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.filtrosVisibles = localStorage.getItem("filtrosVisibles") === "true";
    this.cargarReservas();
  }

  toggleFiltros() {
    this.filtrosVisibles = !this.filtrosVisibles;
    localStorage.setItem("filtrosVisibles", this.filtrosVisibles.toString());
  }

  cargarReservas(page: number = 0) {
    let params = new HttpParams().set('page', page.toString());

    this.http.get<any>('http://localhost:8080/api/admin/reservas', { params })
      .subscribe(response => {
        this.reservas = response.reservas;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      }, error => {
        console.error('Error al cargar reservas', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las reservas',
          customClass: { popup: 'swal-custom-popup' }
        });
      });
  }

  filtrarPorFechas() {
    if (!this.fechaInicio || !this.fechaFin) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Debe seleccionar ambas fechas para filtrar',
        customClass: { popup: 'swal-custom-popup' }
      });
      return;
    }

    if (this.fechaInicio > this.fechaFin) {
      Swal.fire({
        icon: 'warning',
        title: 'Fechas inválidas',
        text: 'La fecha de inicio no puede ser mayor que la fecha fin',
        customClass: { popup: 'swal-custom-popup' }
      });
      return;
    }

    let params = new HttpParams()
      .set('fechaInicio', this.fechaInicio)
      .set('fechaFin', this.fechaFin)
      .set('page', '0');

    this.http.get<any>('http://localhost:8080/api/admin/reservas/filtrar-fechas', { params })
      .subscribe(response => {
        this.reservas = response.reservas;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      }, error => {
        console.error('Error al filtrar por fechas', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron filtrar las reservas',
          customClass: { popup: 'swal-custom-popup' }
        });
      });
  }

  filtrarPorEstado() {
    if (!this.estadoFiltro) {
      Swal.fire({
        icon: 'warning',
        title: 'Estado requerido',
        text: 'Debe seleccionar un estado para filtrar',
        customClass: { popup: 'swal-custom-popup' }
      });
      return;
    }

    let params = new HttpParams()
      .set('estado', this.estadoFiltro)
      .set('page', '0');

    this.http.get<any>('http://localhost:8080/api/admin/reservas/filtrar-estado', { params })
      .subscribe(response => {
        this.reservas = response.reservas;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      }, error => {
        console.error('Error al filtrar por estado', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron filtrar las reservas',
          customClass: { popup: 'swal-custom-popup' }
        });
      });
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.estadoFiltro = '';
    this.cargarReservas(0);
  }

  cambiarPagina(page: number) {
    if (page >= 0 && page < this.totalPages) {
      // Si hay filtros aplicados, mantenerlos en la paginación
      if (this.fechaInicio && this.fechaFin) {
        this.filtrarPorFechasPaginado(page);
      } else if (this.estadoFiltro) {
        this.filtrarPorEstadoPaginado(page);
      } else {
        this.cargarReservas(page);
      }
    }
  }

  private filtrarPorFechasPaginado(page: number) {
    let params = new HttpParams()
      .set('fechaInicio', this.fechaInicio)
      .set('fechaFin', this.fechaFin)
      .set('page', page.toString());

    this.http.get<any>('http://localhost:8080/api/admin/reservas/filtrar-fechas', { params })
      .subscribe(response => {
        this.reservas = response.reservas;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      });
  }

  private filtrarPorEstadoPaginado(page: number) {
    let params = new HttpParams()
      .set('estado', this.estadoFiltro)
      .set('page', page.toString());

    this.http.get<any>('http://localhost:8080/api/admin/reservas/filtrar-estado', { params })
      .subscribe(response => {
        this.reservas = response.reservas;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      });
  }

  verDetalle(id: number) {
    this.http.get<any>(`http://localhost:8080/api/admin/reservas/${id}`)
      .subscribe(reserva => {
        Swal.fire({
          title: `Detalles de Reserva #${reserva.id}`,
          html: `
            <div style="text-align: left;">
              <p><strong>Cliente:</strong> ${reserva.cliente?.nombre || 'N/A'}</p>
              <p><strong>Inmueble:</strong> ${reserva.inmueble?.nombre || 'N/A'}</p>
              <p><strong>Método de Pago:</strong> ${reserva.metodoPago}</p>
              <p><strong>Monto Total:</strong> S/. ${reserva.montoTotal}</p>
              <p><strong>Fecha Inicio:</strong> ${new Date(reserva.fechaInicio).toLocaleDateString('es-PE')}</p>
              <p><strong>Fecha Fin:</strong> ${new Date(reserva.fechaFin).toLocaleDateString('es-PE')}</p>
              <p><strong>Estado:</strong> ${reserva.estadoReserva}</p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Cerrar',
          width: '500px',
          customClass: { popup: 'swal-custom-popup' }
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los detalles de la reserva',
          customClass: { popup: 'swal-custom-popup' }
        });
      });
  }

  cambiarEstado(reserva: any) {
    const estados = ['Solicitado', 'Aprobado', 'Cancelado', 'Finalizado'];
    
    Swal.fire({
      title: `Cambiar estado de Reserva #${reserva.id}`,
      text: `Estado actual: ${reserva.estadoReserva}`,
      input: 'select',
      inputOptions: {
        'Solicitado': 'Solicitado',
        'Aprobado': 'Aprobado',
        'Cancelado': 'Cancelado',
        'Finalizado': 'Finalizado'
      },
      inputPlaceholder: 'Seleccionar nuevo estado',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal-custom-popup' },
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un estado';
        }
        if (value === reserva.estadoReserva) {
          return 'El estado seleccionado es el mismo actual';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.actualizarEstado(reserva.id, result.value);
      }
    });
  }

  private actualizarEstado(id: number, nuevoEstado: string) {
    let params = new HttpParams().set('estado', nuevoEstado);
    
    this.http.put<any>(`http://localhost:8080/api/admin/reservas/${id}/estado`, null, { params })
      .subscribe(response => {
        Swal.fire({
          title: '¡Estado actualizado!',
          text: response.mensaje,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
        // Recargar la página actual manteniendo filtros
        if (this.fechaInicio && this.fechaFin) {
          this.filtrarPorFechasPaginado(this.currentPage);
        } else if (this.estadoFiltro) {
          this.filtrarPorEstadoPaginado(this.currentPage);
        } else {
          this.cargarReservas(this.currentPage);
        }
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.mensaje || 'No se pudo actualizar el estado',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
      });
  }

  confirmarEliminacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta reserva?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal-custom-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarReserva(id);
      }
    });
  }

  eliminarReserva(id: number) {
    this.http.delete(`http://localhost:8080/api/admin/reservas/${id}`)
      .subscribe(() => {
        Swal.fire({
          title: '¡Reserva eliminada!',
          text: 'La reserva se ha eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
        // Recargar manteniendo filtros y página actual
        if (this.fechaInicio && this.fechaFin) {
          this.filtrarPorFechasPaginado(this.currentPage);
        } else if (this.estadoFiltro) {
          this.filtrarPorEstadoPaginado(this.currentPage);
        } else {
          this.cargarReservas(this.currentPage);
        }
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: error.error?.mensaje || 'No se pudo eliminar la reserva',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
      });
  }
}