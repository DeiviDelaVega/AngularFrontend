// src/app/cliente/misReservas/misReservas.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';

import { MisReservasService } from './mis-reservas.service';
import { MisReservasResponse, Reserva } from './mis-reservas.models';
import { HeaderClienteComponent } from '../../shared/header-cliente/header-cliente.component';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, HeaderClienteComponent],
  styleUrl: './misReservas.component.scss',
  templateUrl: './misReservas.component.html'
})
export class MisReservasComponent implements OnInit {
  private srv = inject(MisReservasService);

  cargando = false;
  error?: string;

  reservas: Reserva[] = [];
  esActivo = true;
  modalSancion = false;
  alerta?: string;

  page = 0;
  size = 5;
  totalPaginas = 0;
  totalElementos = 0;
  hasNext = false;
  hasPrevious = false;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(page: number = this.page) {
    this.cargando = true;
    this.error = undefined;
    this.srv.listar(page, this.size).subscribe({
      next: (res: MisReservasResponse) => {
        this.cargando = false;
        this.reservas = res.reservas ?? [];
        this.esActivo = res.esActivo;
        this.modalSancion = res.modalSancion;
        this.alerta = res.alerta;

        this.page = res.paginacion.page ?? 0;
        this.size = res.paginacion.size ?? this.size;
        this.totalPaginas = res.paginacion.totalPaginas ?? 0;
        this.totalElementos = res.paginacion.totalElementos ?? this.reservas.length;
        this.hasNext = !!res.paginacion.hasNext;
        this.hasPrevious = !!res.paginacion.hasPrevious;
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo cargar tus reservas.';
      }
    });
  }

cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas) {
    this.page = nuevaPagina;   // 👈 aseguras que el front se actualice
    this.cargar(nuevaPagina);
  }
}


  puedeReembolsar(reserva: Reserva): boolean {
    if (!reserva?.fechaSolicitud) return false;
    const f = new Date(reserva.fechaSolicitud);
    const diffMin = (Date.now() - f.getTime()) / 60000;
    return diffMin <= 1;
  }

  confirmarReembolso(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cancelará tu reserva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reembolsar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.srv.reembolsar(id).subscribe({
          next: () => {
            this.reservas = this.reservas.filter(r => r.id !== id);
            Swal.fire('Éxito', 'La reserva se ha eliminado correctamente', 'success');
          },
          error: (err: any) => {
            console.error('Error al reembolsar:', err);
            Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
          }
        });
      }
    });
  }

  generarPDF(reserva: Reserva) {
    const doc = new jsPDF();
    const margin = 30;
    let y = margin;

    const idReserva = (reserva.id ?? reserva.idSolicitud ?? '').toString();
    const nombre = reserva.inmueble?.nombre ?? '';
    const descripcion = reserva.inmueble?.descripcion ?? '';
    const servicios = reserva.inmueble?.serviciosIncluidos ?? '';
    const fechaInicio = reserva.fechaInicio ?? '';
    const fechaFin = reserva.fechaFin ?? '';
    const total = (reserva.montoTotal ?? 0).toFixed(2);
    const estado = reserva.estadoReserva ?? '';
    const nombreCliente = reserva.cliente?.nombre ?? 'Invitado';

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 10, 'F');

    y += 15;
    doc.setFontSize(12);

    doc.setFont('helvetica', 'bold');
    doc.text('Nombre de la empresa:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text('Polo Web Reservas', margin + 90, y); y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Dirección:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text('Izaguirre, Lima - Perú', margin + 90, y); y += 27;

    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(nombreCliente, margin + 90, y); y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Inmueble:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(nombre, margin + 90, y); y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('ID de Solicitud:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(idReserva, margin + 90, y); y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Descripción:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(descripcion, 150), margin + 90, y); y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Servicios incluidos:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(servicios, 150), margin + 90, y); y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Fecha de inicio:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(fechaInicio, margin + 90, y); y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Fecha de fin:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(fechaFin, margin + 90, y); y += 10;

    doc.line(margin, y, 210 - margin, y); y += 10;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Monto Total: S/. ' + total, margin, y); y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    doc.line(margin, y, 210 - margin, y); y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Método de pago:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text('Tarjeta', margin + 35, y); y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Estado de reserva:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(estado, margin + 42, y); y += 10;

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 287, 210, 10, 'F');

    doc.save(`reserva-${idReserva}.pdf`);
  }

  paginaAnterior() { if (this.hasPrevious) this.cargar(this.page - 1); }
  paginaSiguiente() { if (this.hasNext) this.cargar(this.page + 1); }
}
