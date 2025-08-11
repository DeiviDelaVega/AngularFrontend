import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';
import { PageResponse } from '../../../core/models/page-response.model';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HeaderAdmin } from "../../../shared/header-admin/header-admin";

@Component({
  selector: 'app-listado-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderAdmin ],
  templateUrl: './listado-cliente.component.html',
  styleUrls: ['./listado-cliente.component.scss']
})

export class ListadoClienteComponent implements OnInit {

  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  clientes: Cliente[] = [];
  loading = true;
  error = '';
  filtro: string = '';
  page = {
    first: true,
    last: false,
    hasPrevious: false,
    hasNext: true,
    paginaActual: 0,
    totalPaginas: 5,
    paginas: [
      { numero: 1, actual: true },
      { numero: 2, actual: false },
      { numero: 3, actual: false },
      { numero: 4, actual: false },
      { numero: 5, actual: false }
    ]
  };
  size = 5;
  totalPages = 0;
  totalElements = 0;

  mostrarFiltros = localStorage.getItem("filtrosClientesVisibles") == "true";

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
    localStorage.setItem("filtrosClientesVisibles", String(this.mostrarFiltros));
  }

  ngOnInit(): void {
    this.cargarClientes();
    this.checkAndShowAlerts();
  }

  cargarClientes(): void {
    this.loading = true;
    this.error = '';

    const request$ = this.filtro.trim()
      ? this.clienteService.getClientesPaginadosConFiltro(this.filtro, this.page.paginaActual, this.size)
      : this.clienteService.getClientesPaginados(this.page.paginaActual, this.size);

    request$.subscribe({
      next: (data: PageResponse<Cliente>) => {
        console.log('Clientes cargados:', data.content);
        this.clientes = data.content || [];
        this.totalPages = data.totalPages || 1;
        this.totalElements = data.totalElements || this.clientes.length;

        this.page.paginaActual = data.number;
        this.page.totalPaginas = data.totalPages;
        this.page.first = data.first;
        this.page.last = data.last;
        this.page.hasNext = !data.last;
        this.page.hasPrevious = !data.first;

        this.updatePaginator(data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar los clientes';
        Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
      }
    });
  }


  updatePaginator(data: any): void {
    const paginas: any[] = []
    const startPage = Math.max(0, data.number - 2);
    const endPage = Math.min(data.totalPages - 1, data.number + 2);

    for (let i = startPage; i <= endPage; i++) {
      paginas.push({
        numero: i + 1,
        actual: i === data.number,
      });
    }
    this.page.paginas = paginas;
  }

  buscar() {
    this.page.paginaActual = 0;
    this.cargarClientes();
  }

  limpiar() {
    this.filtro = '';
    this.page.paginaActual = 0;
    this.cargarClientes();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.page.paginaActual = nuevaPagina;
      this.cargarClientes();
    }
  }

  confirmacionEliminacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este cliente?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-custom-popup'
      }})
      .then((result) => {
        if(result.isConfirmed){
          this.eliminarCliente(id);
        }
      });
  }

  eliminarCliente(id: number) {
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Cliente eliminado!',
          text: 'El cliente fue eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'swal-custom-popup'
          }
        });
        // Recargamos la lista de clientes después de la eliminación exitosa
        this.clientes = this.clientes.filter(cliente => cliente.idCliente ! == id);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el cliente',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'swal-custom-popup'
          }
        });
      }
    });
  }

  private checkAndShowAlerts(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const actualizado = params['actualizado'];
      const eliminado = params['eliminado'];

      if (actualizado !== undefined) {
        Swal.fire({
          title: actualizado === 'true' ? '¡Actualizado!' : 'Error',
          text: actualizado === 'true'
            ? 'El cliente se actualizó correctamente'
            : 'No se pudo actualizar el cliente. Intente nuevamente',
          icon: actualizado === 'true' ? 'success' : 'error',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
        this.router.navigate([], {
          queryParams: { actualizado: null },
          queryParamsHandling: 'merge'
        });
      }

      if (eliminado !== undefined) {
        Swal.fire({
          title: eliminado === 'true' ? '¡Eliminado!' : 'Error',
          text: eliminado === 'true'
            ? 'El cliente fue eliminado correctamente'
            : 'No se pudo eliminar el cliente. Intente nuevamente',
          icon: eliminado === 'true' ? 'success' : 'error',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
        this.router.navigate([], {
          queryParams: { eliminado: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }
}
