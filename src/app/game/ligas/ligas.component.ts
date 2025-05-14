import { Component, OnInit } from '@angular/core';
import { LigasService } from '../../services/ligas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-ligas',
  templateUrl: './ligas.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./ligas.component.css']
})
export class LigasComponent implements OnInit {
  nombreNuevaLiga: string = '';
  misLigas: any[] = [];
  todasLigas: any[] = [];
  participantes: any[] = [];
  ligaSeleccionada: any = null;
  nuevoParticipanteUsername: string = '';
  mostrarPopup: boolean = false;
  ligaIdParaUnirse: any = null;
  codigoUnirse: string = '';
  tipoPopup: 'crear' | 'unirse' | null = null;


  
  constructor(
    private ligasService: LigasService,
    private router: Router // Inyectamos Router para el botón "Volver"
  ) {}

  ngOnInit() {
    this.obtenerMisLigas();
    this.obtenerTodasLigas();
  }
  
  irADetalleLiga(liga: any): void {
    this.router.navigate(['/game/ligas', liga.id]);
  }

  // Crear nueva liga
  crearLiga() {
    if (!this.nombreNuevaLiga.trim()) {
      alert('Por favor ingresa un nombre para la liga.');
      return;
    }

    this.ligasService.crearLiga(this.nombreNuevaLiga).subscribe({
      next: (response) => {
        alert(`Liga creada exitosamente. Código: ${response.codigo_unico}`);
        this.obtenerMisLigas();
        this.obtenerTodasLigas();
      },
      error: (error) => {
        console.error('Error al crear liga', error);
        alert('Error al crear la liga');
      }
    });
  }

  // Obtener mis ligas
  obtenerMisLigas() {
    this.ligasService.obtenerMisLigas().subscribe({
      next: (data) => {
        this.misLigas = data;
      },
      error: (error) => {
        console.error('Error al obtener mis ligas', error);
      }
    });
  }

  // Obtener todas las ligas
  obtenerTodasLigas() {
    this.ligasService.obtenerTodasLigas().subscribe({
      next: (data) => {
        this.todasLigas = data;
      },
      error: (error) => {
        console.error('Error al obtener todas las ligas', error);
      }
    });
  }

  // Obtener participantes de la liga seleccionada
  obtenerParticipantes() {
    if (this.ligaSeleccionada) {
      this.ligasService.obtenerParticipantes(this.ligaSeleccionada.id).subscribe({
        next: (data) => {
          this.participantes = data;
        },
        error: (error) => {
          console.error('Error al obtener participantes', error);
        }
      });
    }
  }

  // Agregar participante a la liga seleccionada
  agregarParticipante() {
    if (!this.nuevoParticipanteUsername.trim()) {
      alert('Ingresa el nombre de usuario');
      return;
    }

    this.ligasService.agregarParticipante(this.ligaSeleccionada.id, this.nuevoParticipanteUsername).subscribe({
      next: () => {
        alert('Participante agregado');
        this.obtenerParticipantes();
      },
      error: (error) => {
        console.error('Error al agregar participante', error);
        alert('Error al agregar participante');
      }
    });
  }

  // Eliminar participante de la liga seleccionada
  eliminarParticipante(username: string) {
    this.ligasService.eliminarParticipante(this.ligaSeleccionada.id, username).subscribe({
      next: () => {
        alert('Participante eliminado');
        this.obtenerParticipantes();
      },
      error: (error) => {
        console.error('Error al eliminar participante', error);
        alert('Error al eliminar participante');
      }
    });
  }

  // Abrir popup para unirse a la liga
  mostrarPopupUnirse(ligaId: number) {
    this.tipoPopup = 'unirse';
    this.ligaIdParaUnirse = ligaId;
    this.mostrarPopup = true;
  }

  abrirPopupCrearLiga() {
  this.tipoPopup = 'crear';
  this.nombreNuevaLiga = '';
  this.mostrarPopup = true;
}

  // Cerrar el popup
cerrarPopup() {
  this.mostrarPopup = false;
  this.codigoUnirse = '';
  this.nombreNuevaLiga = '';
  this.ligaIdParaUnirse = null;
  this.tipoPopup = null; // <-- limpia tipoPopup al cerrar
}


  // Lógica para unirse a una liga
  unirseConCodigo() {
    if (!this.codigoUnirse.trim()) {
      alert('Código requerido');
      return;
    }

    this.ligasService.unirsePorCodigo(this.codigoUnirse).subscribe({
      next: (res) => {
        alert(res.mensaje || 'Te has unido a la liga');
        this.obtenerMisLigas();
        this.obtenerTodasLigas();
        this.cerrarPopup();
      },
      error: (error) => {
        alert(error.error.error || 'Código incorrecto');
      }
    });
  }
  abrirPopupLiga(liga: any) {
  this.ligaSeleccionada = liga;
  this.obtenerParticipantes();
}

}
