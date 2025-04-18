import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';

@Component({
  selector: 'app-mi-equipo',
  imports: [CommonModule],
  templateUrl: './mi-equipo.component.html',
  styleUrl: './mi-equipo.component.css'
})
export class MiEquipoComponent implements OnInit {
  presupuesto: number | null = null;
  error: string = '';

  constructor(private equipoService: RallyService) {}

  ngOnInit(): void {
    // Verifica la cookie de sesión cuando el componente se inicializa
    this.equipoService.logSessionCookie(); // Verificar cookie de sesión

    // Luego hacer la petición para obtener el presupuesto
    this.equipoService.getPresupuesto().subscribe({
      next: (data) => {
        this.presupuesto = data.presupuesto;
      },
      error: (err) => {
        console.error('Error al obtener el presupuesto:', err);
        this.error = 'No se pudo cargar el presupuesto';
      }
    });
  }
}
