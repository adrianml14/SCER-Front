import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { HttpHeaders } from '@angular/common/http';
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
  error: string = '';

  pilotos: any[] = [];
  copilotos: any[] = [];
  coches: any[] = [];
  
  elementoSeleccionado: any = null;
  tipoSeleccionado: 'piloto' | 'copiloto' | 'coche' | null = null;

  constructor(private equipoService: RallyService) {}

  ngOnInit(): void {
    fetch('http://127.0.0.1:8000/api/rally/presupuesto/', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => console.log('✅ Presupuesto desde fetch:', data))
    .catch(err => console.error('❌ Error en fetch:', err));

    const token = localStorage.getItem('token');

    if (token) {
      // Presupuesto
      this.equipoService.getPresupuesto().subscribe({
        next: (data) => {
          this.presupuesto = data.presupuesto;
        },
        error: (err) => {
          console.error('Error al obtener el presupuesto:', err);
          this.error = 'No se pudo cargar el presupuesto';
        }
      });

      // Pilotos
      this.equipoService.getMisPilotos().subscribe({
        next: (data) => this.pilotos = data,
        error: () => console.error('Error al cargar pilotos')
      });

      // Copilotos
      this.equipoService.getMisCopilotos().subscribe({
        next: (data) => this.copilotos = data,
        error: () => console.error('Error al cargar copilotos')
      });

      // Coches
      this.equipoService.getMisCoches().subscribe({
        next: (data) => this.coches = data,
        error: () => console.error('Error al cargar coches')
      });

    } else {
      console.error('Token no encontrado');
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
    // Llamar a la API para vender el elemento
    if (!this.elementoSeleccionado || !this.tipoSeleccionado) return;

    const tipo = this.tipoSeleccionado;
    const idElemento = this.elementoSeleccionado.id;

    this.equipoService.venderElemento(tipo, idElemento).subscribe({
      next: (data) => {

        Swal.fire({
          title: data.mensaje || 'Elemento vendido exitosamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // Actualizar presupuesto localmente
        if (this.presupuesto !== null) {
          this.presupuesto += Number(this.elementoSeleccionado.precio);
        }

        // Eliminar el elemento del equipo
        if (tipo === 'piloto') {
          this.pilotos = this.pilotos.filter(p => p.id !== idElemento);
        } else if (tipo === 'copiloto') {
          this.copilotos = this.copilotos.filter(c => c.id !== idElemento);
        } else if (tipo === 'coche') {
          this.coches = this.coches.filter(c => c.id !== idElemento);
        }

        this.cerrarPopup(); // Cerrar el popup después de vender
      },
      error: (err) => {
        console.error('Error al vender el elemento:', err);
        this.error = 'No se pudo vender el elemento';
      }
    });
  }

}
