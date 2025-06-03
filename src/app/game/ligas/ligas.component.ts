import { Component, OnInit } from '@angular/core';
import { LigasService } from '../../services/ligas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';
import Swal from 'sweetalert2'; // <-- Importación agregada

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
  esVIP: boolean = false;
  usuarioUsername: string = '';
  clasificacionGeneral: any[] = [];

  constructor(
    private ligasService: LigasService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.verificarRolUsuario();
    this.obtenerClasificacionGeneral();
    this.actualizarLigas();
  }

  verificarRolUsuario() {
    this.userService.getPerfil().subscribe({
      next: (res) => {
        this.esVIP = res.rol === 'VIP';
        this.usuarioUsername = res.username;
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
      Swal.fire('Nombre requerido', 'Por favor ingresa un nombre para la liga.', 'warning');
      return;
    }

    this.ligasService.crearLiga(this.nombreNuevaLiga).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Liga creada',
          text: `Código: ${response.codigo_unico}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.actualizarLigas();
        this.cerrarPopup();
      },
      error: (error) => {
        console.error('Error al crear liga', error);
        Swal.fire('Error', 'No se pudo crear la liga', 'error');
      }
    });
  }

  actualizarLigas() {
    this.ligasService.obtenerMisLigas().subscribe({
      next: (misLigasData) => {
        this.misLigas = misLigasData;
        this.ligasService.obtenerTodasLigas().subscribe({
          next: (todasLigasData) => {
            this.todasLigas = todasLigasData.map(liga => {
              const yaEstoy = this.misLigas.some(mia => mia.liga === liga.id);
              return {
                ...liga,
                soyParticipante: yaEstoy
              };
            });
          },
          error: (error) => {
            console.error('Error al obtener todas las ligas', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener mis ligas', error);
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
      Swal.fire('Campo vacío', 'Ingresa el nombre de usuario', 'warning');
      return;
    }

    this.ligasService.agregarParticipante(this.ligaSeleccionada.id, this.nuevoParticipanteUsername).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Participante agregado', 'success');
        this.obtenerParticipantes();
      },
      error: (error) => {
        console.error('Error al agregar participante', error);
        Swal.fire('Error', 'No se pudo agregar el participante', 'error');
      }
    });
  }

  eliminarParticipante(username: string) {
    this.ligasService.eliminarParticipante(this.ligaSeleccionada.id, username).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'Participante eliminado', 'success');
        this.obtenerParticipantes();
      },
      error: (error) => {
        console.error('Error al eliminar participante', error);
        Swal.fire('Error', 'No se pudo eliminar el participante', 'error');
      }
    });
  }

  dejarLiga(ligaId: number) {
    this.ligasService.salirDeLiga(ligaId).subscribe({
      next: () => {
        Swal.fire({
          title: 'Te Saliste de la liga',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.actualizarLigas();
      },
      error: (error) => {
        console.error('Error al salir de la liga', error);
        Swal.fire('Error', 'No se pudo salir de la liga', 'error');
      }
    });
  }

  mostrarPopupUnirse(liga: any) {
    this.tipoPopup = 'unirse';
    this.ligaIdParaUnirse = liga;
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
      Swal.fire('Código requerido', 'Por favor ingresa un código', 'warning');
      return;
    }

    this.ligasService.unirsePorCodigo(this.codigoUnirse).subscribe({
      next: (res) => {
        Swal.fire({
          title: res.mensaje || 'Te has unido a la liga',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.actualizarLigas();
        this.cerrarPopup();
      },
      error: (error) => {
        Swal.fire('Error', error.error.error || 'Código incorrecto', 'error');
      }
    });
  }

  abrirPopupLiga(liga: any) {
    this.ligaSeleccionada = liga;
    this.obtenerParticipantes();
  }

  obtenerClasificacionGeneral() {
    this.ligasService.obtenerClasificacionGeneral().subscribe({
      next: (data) => {
        this.clasificacionGeneral = data;
      },
      error: (error) => {
        console.error('Error al obtener clasificación general', error);
      }
    });
  }
}
