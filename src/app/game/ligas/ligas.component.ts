import { Component, OnInit } from '@angular/core';
import { LigasService } from '../../services/ligas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';
import { RallyService } from '../../services/rally.service';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-ligas',
  templateUrl: './ligas.component.html',
  imports: [CommonModule, FormsModule, TranslateModule],
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
    private rallyService: RallyService,
    private router: Router,
    private translate: TranslateService
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
      Swal.fire(
        this.translate.instant('common.required'),
        this.translate.instant('leagues.leagueNamePlaceholder'),
        'warning'
      );
      return;
    }

    this.ligasService.crearLiga(this.nombreNuevaLiga).subscribe({
      next: (response) => {
        Swal.fire({
          title: this.translate.instant('leagues.createLeague'),
          text: `${this.translate.instant('leagues.code')}: ${response.codigo_unico}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.actualizarLigas();
        this.cerrarPopup();
      },
      error: () => {
        console.error('Error al crear liga');
        Swal.fire('Error', this.translate.instant('common.createError'), 'error');
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
      Swal.fire(
        this.translate.instant('common.required'),
        this.translate.instant('common.enterUsername'),
        'warning'
      );
      return;
    }

    this.ligasService.agregarParticipante(this.ligaSeleccionada.id, this.nuevoParticipanteUsername).subscribe({
      next: () => {
        Swal.fire(this.translate.instant('common.success'), this.translate.instant('common.userAdded'), 'success');
        this.obtenerParticipantes();
      },
      error: () => {
        console.error('Error al agregar participante');
        Swal.fire('Error', this.translate.instant('common.userAddError'), 'error');
      }
    });
  }

  eliminarParticipante(username: string) {
    this.ligasService.eliminarParticipante(this.ligaSeleccionada.id, username).subscribe({
      next: () => {
        Swal.fire(this.translate.instant('common.deleted'), this.translate.instant('common.userDeleted'), 'success');
        this.obtenerParticipantes();
      },
      error: () => {
        console.error('Error al eliminar participante');
        Swal.fire('Error', this.translate.instant('common.userDeleteError'), 'error');
      }
    });
  }

  dejarLiga(ligaId: number) {
    this.ligasService.salirDeLiga(ligaId).subscribe({
      next: () => {
        Swal.fire({
          title: this.translate.instant('leagues.leave'),
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.actualizarLigas();
      },
      error: () => {
        console.error('Error al salir de la liga');
        Swal.fire('Error', this.translate.instant('common.leaveError'), 'error');
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
      Swal.fire(
        this.translate.instant('common.required'),
        this.translate.instant('leagues.codePlaceholder'),
        'warning'
      );
      return;
    }

    this.ligasService.unirsePorCodigo(this.codigoUnirse).subscribe({
      next: (res) => {
        Swal.fire({
          title: res.mensaje || this.translate.instant('leagues.joinLeague'),
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.actualizarLigas();
        this.cerrarPopup();
      },
      error: (error) => {
        Swal.fire('Error', error.error.error || this.translate.instant('common.invalidCode'), 'error');
      }
    });
  }

  abrirPopupLiga(liga: any) {
    this.ligaSeleccionada = liga;
    this.obtenerParticipantes();
  }

  obtenerClasificacionGeneral() {
    this.rallyService.getClasificacionGeneral().subscribe({
      next: (data) => {
        this.clasificacionGeneral = data;
      },
      error: (error) => {
        console.error('Error al obtener clasificación general', error);
      }
    });
  }
}
