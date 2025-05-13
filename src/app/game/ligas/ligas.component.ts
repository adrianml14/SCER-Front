// src/app/components/ligas/ligas.component.ts
import { Component } from '@angular/core';
import { LigasService } from '../../services/ligas.service'; // Importar el servicio
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ligas',
  templateUrl: './ligas.component.html',
    imports: [CommonModule,FormsModule],
  styleUrls: ['./ligas.component.css']
})
export class LigasComponent {
  nombreNuevaLiga: string = '';
  misLigas: any[] = [];
  participantes: any[] = [];
  ligaSeleccionada: number = 0;
  nuevoParticipanteUsername: string = '';

  constructor(private ligasService: LigasService) {}


  
  // Crear una liga
  crearLiga() {
    if (!this.nombreNuevaLiga.trim()) {
      alert('Por favor ingresa un nombre para la liga.');
      return;
    }

    this.ligasService.crearLiga(this.nombreNuevaLiga).subscribe({
      next: (response) => {
        alert(`Liga creada exitosamente. Código para unirse: ${response.codigo_unico}`);
        this.obtenerMisLigas();
      },
      error: (error) => {
        console.error('Error al crear liga', error);
        alert('Hubo un error al crear la liga');
      }
    });
  }


  // Obtener las ligas del usuario
  obtenerMisLigas() {
    this.ligasService.obtenerMisLigas().subscribe({
      next: (data) => {
        this.misLigas = data;
      },
      error: (error) => {
        console.error('Error al obtener ligas', error);
      }
    });
  }

  // Obtener los participantes de una liga seleccionada
  obtenerParticipantes() {
    if (this.ligaSeleccionada) {
      this.ligasService.obtenerParticipantes(this.ligaSeleccionada).subscribe({
        next: (data) => {
          this.participantes = data;
        },
        error: (error) => {
          console.error('Error al obtener participantes', error);
        }
      });
    }
  }

  // Agregar un participante a la liga
  agregarParticipante() {
    if (!this.nuevoParticipanteUsername.trim()) {
      alert('Por favor ingresa el nombre de usuario del participante.');
      return;
    }

    this.ligasService.agregarParticipante(this.ligaSeleccionada, this.nuevoParticipanteUsername).subscribe({
      next: (response) => {
        alert('Participante agregado exitosamente');
        this.obtenerParticipantes();  // Volver a cargar la lista de participantes
      },
      error: (error) => {
        console.error('Error al agregar participante', error);
        alert('Hubo un error al agregar al participante');
      }
    });
  }

  // Eliminar un participante de la liga
  eliminarParticipante(username: string) {
    this.ligasService.eliminarParticipante(this.ligaSeleccionada, username).subscribe({
      next: (response) => {
        alert('Participante eliminado exitosamente');
        this.obtenerParticipantes();  // Volver a cargar la lista de participantes
      },
      error: (error) => {
        console.error('Error al eliminar participante', error);
        alert('Hubo un error al eliminar al participante');
      }
    });
  }
}
