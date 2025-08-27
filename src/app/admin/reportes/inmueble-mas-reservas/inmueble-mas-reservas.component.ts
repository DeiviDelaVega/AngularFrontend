import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables, ChartType } from 'chart.js';
import { HeaderAdmin } from "../../../shared/header-admin/header-admin";

Chart.register(...registerables);

@Component({
  selector: 'app-inmueble-mas-reservas',
  imports: [HeaderAdmin],
  templateUrl: './inmueble-mas-reservas.component.html',
  styleUrls: ['./inmueble-mas-reservas.component.scss']
})
export class InmuebleMasReservasComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/admin/reportes/inmuebles-mas-reservados';
  chart: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos(); // carga inicial con gráfico de barras
  }

  // Carga datos para el gráfico
  cargarDatos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        const labels = data.map(item => item.inmueble);
        const valores = data.map(item => item.total);
        this.renderChart(labels, valores, 'bar'); // gráfico inicial tipo barras
      },
      error: (err) => {
        console.error('Error cargando inmuebles más reservados:', err);
      }
    });
  }

  // Renderiza el gráfico
  renderChart(labels: string[], valores: number[], tipo: ChartType = 'bar'): void {
    const ctx = document.getElementById('graficoInmuebles') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: tipo,
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de Reservas',
          data: valores,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
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
          legend: { display: tipo !== 'bar' } // solo mostrar leyenda para pastel/dona
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

  // Evento para cambiar tipo de gráfico
  cambiarTipoGrafico(event: any): void {
    const nuevoTipo = event.target.value as ChartType;
    this.cargarDatosConTipo(nuevoTipo);
  }

  // Cargar datos y renderizar con tipo dinámico
  cargarDatosConTipo(tipo: ChartType): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        const labels = data.map(item => item.inmueble);
        const valores = data.map(item => item.total);
        this.renderChart(labels, valores, tipo);
      },
      error: (err) => {
        console.error('Error cargando inmuebles más reservados:', err);
      }
    });
  }
}
