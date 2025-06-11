import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { MatTabsModule } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { UserService } from '../../services/users.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mi-equipo',
  standalone: true,
  imports: [CommonModule, MatTabsModule, TranslateModule],
  templateUrl: './mi-equipo.component.html',
  styleUrls: ['./mi-equipo.component.css']
})
export class MiEquipoComponent implements OnInit {
  presupuesto: number | null = null;
  nombreEquipo: string = '';
  error: string = '';
  clasificacionUsuario: any[] = [];
  mostrarClasificacion: boolean = false;
  usuarioUsername: string = '';

  pilotos: any[] = [];
  copilotos: any[] = [];
  coches: any[] = [];

  elementoSeleccionado: any = null;
  tipoSeleccionado: 'piloto' | 'copiloto' | 'coche' | null = null;

  constructor(
    private equipoService: RallyService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.error = this.translate.instant('team.tokenNotFound');
      return;
    }

    this.userService.getPerfil().subscribe({
      next: (perfil) => {
        this.usuarioUsername = perfil.username;

        this.equipoService.getClasificacionPorRally().subscribe({
          next: (data) => {
            this.clasificacionUsuario = data
              .map((rallyEntry: any) => {
                const userEntry = rallyEntry.clasificacion.find(
                  (c: any) => c.usuario === this.usuarioUsername
                );
                return userEntry ? { rally: rallyEntry.rally, puntos: userEntry.puntos } : null;
              })
              .filter((entry: any) => entry !== null);
          },
          error: (err) => {
            console.error('Error al cargar la clasificación por rally:', err);
          }
        });
      },
      error: (err) => {
        this.error = this.translate.instant('team.profileLoadError');
      }
    });

    this.equipoService.getPresupuesto().subscribe({
      next: (data) => this.presupuesto = data.presupuesto,
      error: (err) => {
        this.error = this.translate.instant('team.budgetLoadError');
      }
    });

    this.equipoService.getNombreEquipo().subscribe({
      next: (data) => {
        this.nombreEquipo = data.nombre || this.translate.instant('team.teamNameDefault');
      },
      error: (err) => {
        this.nombreEquipo = this.translate.instant('team.teamNameDefault');
        this.error = this.translate.instant('team.teamNameLoadError');
      }
    });

    this.equipoService.getMisPilotos().subscribe({
      next: (data) => this.pilotos = data,
      error: () => {
        this.error = this.translate.instant('team.driversLoadError');
      }
    });

    this.equipoService.getMisCopilotos().subscribe({
      next: (data) => this.copilotos = data,
      error: () => {
        this.error = this.translate.instant('team.coDriversLoadError');
      }
    });

    this.equipoService.getMisCoches().subscribe({
      next: (data) => this.coches = data,
      error: () => {
        console.error('Error al cargar coches');
        this.error = this.translate.instant('team.carsLoadError');
      }
    });
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
          title: this.translate.instant('team.sellSuccess'),
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
        this.error = this.translate.instant('team.sellError');
      }
    });
  }
}
