import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-mi-equipo',
  imports: [CommonModule],
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.css']
})
export class MiEquipoComponent implements OnInit {
  presupuesto: number | null = null;
  error: string = '';

  constructor(private equipoService: RallyService) {}

  ngOnInit(): void {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Hacer la petición para obtener el presupuesto
      this.equipoService.getPresupuesto(token).subscribe({
        next: (data) => {
          this.presupuesto = data.presupuesto;
        },
        error: (err) => {
          console.error('Error al obtener el presupuesto:', err);
          this.error = 'No se pudo cargar el presupuesto';
        }
      });
    } else {
      console.error('Token no encontrado');
      this.error = 'No se encontró el token. Por favor, inicia sesión nuevamente.';
    }
  }
}
