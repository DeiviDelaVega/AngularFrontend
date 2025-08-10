import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService, Cliente } from '../../../core/services/cliente.service'; 


@Component({
  selector: 'app-detalle-cliente',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-cliente.component.html',
  styleUrl: './detalle-cliente.scss'
})
export class DetalleClienteComponent implements OnInit{
  private clienteService = inject(ClienteService);
  private activatedRoute = inject(ActivatedRoute);

  cliente: Cliente | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = +params['id']; // El '+' convierte el string del id a un número
      if (id) {
        this.cargarDetalleCliente(id);
      } else {
        this.loading = false;
        this.error = 'ID de cliente no proporcionado.';
      }
    });
  }

  cargarDetalleCliente(id: number): void {
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
        // Puedes redirigir o mostrar un mensaje de error
      }
    });
  }
}
