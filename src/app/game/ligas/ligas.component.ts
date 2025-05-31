import { Component, OnInit } from '@angular/core';
import { LigasService } from '../../services/ligas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';

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
  esVIP: boolean = false; // 👈 Define flag para mostrar el botón

  constructor(
    private ligasService: LigasService,
    private userService: UserService, // 👈 Inyecta el servicio
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerMisLigas();
    this.obtenerTodasLigas();
    this.verificarRolUsuario(); // 👈 Carga el rol
  }

  verificarRolUsuario() {
    this.userService.getPerfil().subscribe({
      next: (res) => {
        this.esVIP = res.rol === 'VIP';
      },
      error: (err) => {
        console.error('Error al obtener perfil', err);
        this.esVIP = false;
      }
    });
  }

  irADetalleLiga(liga: any): void {
    this.router.navigate(['/game/ligas', liga.id]);
  }

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

  cerrarPopup() {
    this.mostrarPopup = false;
    this.codigoUnirse = '';
    this.nombreNuevaLiga = '';
    this.ligaIdParaUnirse = null;
    this.tipoPopup = null;
  }

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
