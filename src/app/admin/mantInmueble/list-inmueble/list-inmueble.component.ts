import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderAdmin } from "../../../shared/header-admin/header-admin";
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-inmueble',
  standalone: true,
  imports: [HeaderAdmin, FormsModule, CommonModule],
  templateUrl: './list-inmueble.component.html',
  styleUrl: './list-inmueble.component.scss'
})

export class ListInmuebleComponent implements OnInit {

  inmuebles: any[] = [];
  administradores: any[] = [];
  currentPage = 0;
  totalPages = 0;
  totalItems = 0;

  filtro: string = '';
  disponibilidad: string = '';
  adminId?: number;

  filtrosVisibles: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.filtrosVisibles = localStorage.getItem("filtrosVisibles") === "true";
    this.cargarInmuebles();
  }

  toggleFiltros() {
    this.filtrosVisibles = !this.filtrosVisibles;
    localStorage.setItem("filtrosVisibles", this.filtrosVisibles.toString());
  }

  cargarInmuebles(page: number = 0) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('filtro', this.filtro)
      .set('disponibilidad', this.disponibilidad);

    if (this.adminId != null) {
      params = params.set('adminId', this.adminId.toString());
    }

    this.http.get<any>('http://localhost:8080/api/admin/inmuebles', { params })
      .subscribe(response => {
        this.inmuebles = response.inmuebles;
        this.administradores = response.administradores;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      }, error => {
        console.error('Error al cargar inmuebles', error);
      });
  }

  limpiarFiltros() {
    this.filtro = '';
    this.disponibilidad = '';
    this.adminId = undefined;
    this.cargarInmuebles(0);
  }

  cambiarPagina(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.cargarInmuebles(page);
    }
  }

  confirmarEliminacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este inmueble?',
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
        this.eliminarInmueble(id);
      }
    });
  }

  eliminarInmueble(id: number) {
    this.http.delete(`http://localhost:8080/api/admin/inmuebles/${id}`)
      .subscribe(() => {
        Swal.fire({
          title: '¡Inmueble eliminado!',
          text: 'El inmueble se ha eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
        this.cargarInmuebles(this.currentPage);
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'No se puede eliminar',
          text: error.error?.message || 'Este inmueble tiene reservas asociadas',
          confirmButtonText: 'Aceptar',
          customClass: { popup: 'swal-custom-popup' }
        });
      });
  }
}