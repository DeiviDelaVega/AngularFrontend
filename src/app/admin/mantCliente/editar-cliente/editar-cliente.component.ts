import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';

import { HeaderAdmin } from '../../../shared/header-admin/header-admin';

@Component({
  selector: 'app-editar-cliente',
  imports: [CommonModule, RouterModule, FormsModule, HeaderAdmin],
  templateUrl: './editar-cliente.component.html',
  styleUrl: './editar-cliente.scss'
})
export class EditarClienteComponent implements OnInit {

  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  cliente: Cliente = {
    idCliente: 0,
    nombre: '',
    apellido: '',
    nroDocumento: '',
    direccion: '',
    numeroTelf: '',
    correo: '',
    estado: '',
  };
  loading = true;
  error = '';

ngOnInit(): void {
  this.activatedRoute.params.subscribe(params => {
    const id =+ params['id'];
    if(id){
      this.cargarCliente(id);
    }else{
      this.loading = false;
      this.error = 'ID de cliente no proporcionado';
    }
  })
}

cargarCliente(id: number): void {
    this.loading = true;
    this.error = '';

    this.clienteService.getClientePorId(id).subscribe({
      next: (data) => {
        this.cliente = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar el cliente.';
        Swal.fire('Error', 'No se pudo encontrar el cliente', 'error');
        this.router.navigate(['/admin/cliente']);
      }
    });
  }
 actualizarCliente(): void {
    Swal.fire({
      title: '¿Confirmar actualización?',
      text: "¿Deseas actualizar los datos del cliente?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-custom-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.actualizarCliente(this.cliente.idCliente, this.cliente).subscribe({
          next: () => {

            this.router.navigate(['/admin/clienteAdmin'], { queryParams: { actualizado: true } });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
            this.router.navigate(['/admin/clienteAdmin'], { queryParams: { actualizado: false } });
          }
        });
      }
    });
  }
}
  
