// src/app/cliente/misReservas/mis-reservas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MisReservasResponse, Reserva } from './mis-reservas.models';

@Injectable({ providedIn: 'root' })
export class MisReservasService {
  private api = environment.api;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 5): Observable<MisReservasResponse> {
    const url = `${this.api}/cliente/misreservas?page=${page}&size=${size}`;
    return this.http.get<any>(url).pipe(
      map((resp: any) => {
        const pageObj = resp.page || resp.paginacion || resp.reservas || resp;
        const content: Reserva[] =
          resp?.reservas?.content ??
          resp?.content ??
          resp?.reservas ??
          [];

        const paginacion = {
          page: pageObj?.number ?? pageObj?.page ?? 0,
          size: pageObj?.size ?? size,
          totalPaginas: pageObj?.totalPages ?? pageObj?.totalPaginas ?? 0,
          totalElementos: pageObj?.totalElements ?? pageObj?.totalElementos ?? content.length,
          hasNext: pageObj?.hasNext ?? (pageObj?.number + 1 < (pageObj?.totalPages ?? 0)),
          hasPrevious: pageObj?.hasPrevious ?? (pageObj?.number > 0),
        };

        const esActivo = !!(resp?.esActivo ?? true);
        const modalSancion = !!(resp?.modalSancion ?? false);
        const alerta = resp?.alerta ?? resp?.mensajeSancion ?? undefined;

        const reservasNorm = content.map((r: any) => ({
          id: r.id ?? r.idSolicitud,
          idSolicitud: r.idSolicitud ?? r.id,
          inmueble: r.inmueble,
          fechaInicio: r.fechaInicio ?? r.fecha_Inicio ?? r.fecha_Inicio_Reserva ?? r.fechaInicioReserva,
          fechaFin: r.fechaFin ?? r.fecha_Fin ?? r.fecha_Fin_Reserva ?? r.fechaFinReserva,
          fechaSolicitud: r.fechaSolicitud ?? r.fecha_Solicitud,
          estadoReserva: r.estadoReserva,
          montoTotal: r.montoTotal,
          cliente: r.cliente,
        })) as Reserva[];

        return {
          reservas: reservasNorm,
          paginacion,
          esActivo,
          modalSancion,
          alerta,
        } as MisReservasResponse;
      }),
      catchError(() =>
        of({
          reservas: [],
          paginacion: { page: 0, size, totalPaginas: 0, totalElementos: 0, hasNext: false, hasPrevious: false },
          esActivo: true,
          modalSancion: false,
        } as MisReservasResponse)
      )
    );
  }

  detalle(id: number) {
    const url = `${this.api}/cliente/misreservas/${id}`;
    return this.http.get<any>(url);
  }

  reembolsar(id: number) {
    const urlDelete = `${this.api}/cliente/misreservas/${id}/reembolso`;
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    console.log("Enviando DELETE con token:", token);
    return this.http.delete(urlDelete, { headers, responseType: 'text' });
  }
}
