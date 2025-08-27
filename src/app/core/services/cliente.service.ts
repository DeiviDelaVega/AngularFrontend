import { Injectable, inject } from '@angular/core';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/page-response.model';

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  nroDocumento?: string;
  direccion?: string;
  numeroTelf?: string;
  correo?: string;
  fechaRegistro?: string;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);


  private baseUrl = 'http://localhost:8080/api/admin/clienteAdmin';

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}`);
  }

  getClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  guardarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente);
  }

  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {


    return this.http.put<Cliente>(`${this.baseUrl}/actualizar/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getClientesPaginados(page: number, size: number) {
    return this.http.get<PageResponse<Cliente>>(

      `${this.baseUrl}/paginado?page=${page}&size=${size}`
    );
  }

  getClientesPaginadosConFiltro(filtro: string, page: number, size: number): Observable<PageResponse<Cliente>> {

    return this.http.get<PageResponse<Cliente>>(`${this.baseUrl}/paginacionFiltro?filtro=${filtro}&page=${page}&size=${size}`);

  }
}