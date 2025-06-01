import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { MatTabsModule } from '@angular/material/tabs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-equipo',
  imports: [CommonModule, MatTabsModule],
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.css']
})
export class MiEquipoComponent implements OnInit {
  presupuesto: number | null = null;
  nombreEquipo: string = 'Mi Equipo';
  error: string = '';

  pilotos: any[] = [];
  copilotos: any[] = [];
  coches: any[] = [];

  elementoSeleccionado: any = null;
  tipoSeleccionado: 'piloto' | 'copiloto' | 'coche' | null = null;

  constructor(private equipoService: RallyService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      // Obtener presupuesto
      this.equipoService.getPresupuesto().subscribe({
        next: (data) => this.presupuesto = data.presupuesto,
        error: (err) => {
          console.error('Error al obtener el presupuesto:', err);
          this.error = 'No se pudo cargar el presupuesto';
        }
      });

      // Obtener nombre del equipo
      this.equipoService.getNombreEquipo().subscribe({
        next: (data) => {
          console.log('Nombre del equipo recibido:', data.nombre); // Verifica lo que se recibe
          this.nombreEquipo = data.nombre || 'Mi Equipo';
        },
        error: (err) => {
          console.error('Error al obtener el nombre del equipo:', err);
          this.nombreEquipo = 'Mi Equipo'; // Valor por defecto en caso de error
        }
      });

      // Cargar elementos del equipo
      this.equipoService.getMisPilotos().subscribe({
        next: (data) => this.pilotos = data,
        error: () => console.error('Error al cargar pilotos')
      });

      this.equipoService.getMisCopilotos().subscribe({
        next: (data) => this.copilotos = data,
        error: () => console.error('Error al cargar copilotos')
      });

      this.equipoService.getMisCoches().subscribe({
        next: (data) => this.coches = data,
        error: () => console.error('Error al cargar coches')
      });
    } else {
      this.error = 'No se encontró el token. Por favor, inicia sesión nuevamente.';
    }
  }

  abrirPopup(tipo: 'piloto' | 'copiloto' | 'coche', item: any) {
    this.tipoSeleccionado = tipo;
    this.elementoSeleccionado = item;
  }

  cerrarPopup() {
    this.elementoSeleccionado = null;
    this.tipoSeleccionado = null;
  }

  vender() {
    if (!this.elementoSeleccionado || !this.tipoSeleccionado) return;

    const tipo = this.tipoSeleccionado;
    const idElemento = this.elementoSeleccionado.id;

    this.equipoService.venderElemento(tipo, idElemento).subscribe({
      next: (data) => {
        Swal.fire({
          title: data.mensaje || 'Elemento vendido exitosamente',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          confirmButtonText: 'OK'
        });

        if (this.presupuesto !== null) {
          this.presupuesto += Number(this.elementoSeleccionado.precio);
        }

        if (tipo === 'piloto') {
          this.pilotos = this.pilotos.filter(p => p.id !== idElemento);
        } else if (tipo === 'copiloto') {
          this.copilotos = this.copilotos.filter(c => c.id !== idElemento);
        } else if (tipo === 'coche') {
          this.coches = this.coches.filter(c => c.id !== idElemento);
        }

        this.cerrarPopup();
      },
      error: (err) => {
        console.error('Error al vender el elemento:', err);
        this.error = 'No se pudo vender el elemento';
      }
    });
  }
}
