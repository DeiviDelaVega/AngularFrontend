// src/app/cliente/misReservas/mis-reservas.models.ts
export interface Inmueble {
  id: number;
  nombre: string;
  descripcion: string;
  serviciosIncluidos: string;
  imagenHabitacion: string;
}

export interface ClienteMini {
  nombre: string;
  apellido?: string;
  correo?: string;
}

export interface Reserva {
  id?: number;                 // algunos back exponen "id"
  idSolicitud?: number;        // otros "idSolicitud"
  inmueble: Inmueble;
  fechaInicio?: string;        // dd/MM/yyyy o ISO - lo usaremos con DatePipe
  fechaFin?: string;
  fechaSolicitud?: string;     // usado para validar reembolso (1 min)
  estadoReserva: string;
  montoTotal: number;
  cliente?: ClienteMini;
}

export interface Paginacion {
  page: number;
  size: number;
  totalPaginas: number;
  totalElementos: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MisReservasResponse {
  reservas: Reserva[];
  paginacion: Paginacion;
  esActivo: boolean;
  modalSancion: boolean;
  alerta?: string;
}
