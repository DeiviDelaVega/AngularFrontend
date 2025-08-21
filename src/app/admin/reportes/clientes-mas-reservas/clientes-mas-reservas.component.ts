import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables, ChartType } from 'chart.js';
import { HeaderAdmin } from "../../../shared/header-admin/header-admin";

Chart.register(...registerables);

@Component({
  selector: 'app-clientes-mas-reservas',
  standalone: true,
  imports: [HeaderAdmin],
  templateUrl: './clientes-mas-reservas.component.html',
  styleUrls: ['./clientes-mas-reservas.component.scss']
})
export class ClientesMasReservasComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/admin/reportes/clientes-mas-reservas';
  chart: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        const labels = data.map(item => item.nombre);
        const valores = data.map(item => item.totalReservas);

        this.renderChart(labels, valores);
      },
      error: (err) => {
        console.error('Error cargando clientes con más reservas:', err);
      }
    });
  }

renderChart(labels: string[], valores: number[], tipo: ChartType = 'bar'): void {
  const ctx = document.getElementById('graficoClientes') as HTMLCanvasElement;

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart(ctx, {
    type: tipo, // ✅ acepta 'bar' | 'pie' | 'doughnut'
    data: {
      labels: labels,
      datasets: [{
        label: 'Cantidad de Reservas',
        data: valores,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: tipo !== 'bar' }
      },
      scales: tipo === 'bar' ? {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Reservas'
          }
        }
      } : {}
    }
  });
}

cambiarTipoGrafico(event: any): void {
  const nuevoTipo = event.target.value as ChartType;
  this.cargarDatosConTipo(nuevoTipo);
}

cargarDatosConTipo(tipo: ChartType): void {
  this.http.get<any[]>(this.apiUrl).subscribe({
    next: (data) => {
      const labels = data.map(item => item.nombre);
      const valores = data.map(item => item.totalReservas);
      this.renderChart(labels, valores, tipo);
    },
    error: (err) => {
      console.error('Error cargando clientes con más reservas:', err);
    }
  });
}


}
