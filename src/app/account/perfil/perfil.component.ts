import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { RallyService } from '../../services/rally.service';
import { BugReport, BugReportService } from '../../services/bug-report.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, TranslateModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  usuario: any;
  error?: string;
  nuevoNombreEquipo: string = '';
  nombreEquipo: string = 'Mi Equipo';
  mostrarPopupBug = false;
  mostrarPopup = false;
  esVIP = false;
  esAdmin = false;

  // Para reporte de bug
  descripcionBug = '';
  reporteEnviado = false;
  errorEnvio = '';

  constructor(
    private userService: UserService,
    private rallyService: RallyService,
    private equipoService: RallyService,
    private bugReportService: BugReportService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.equipoService.getNombreEquipo().subscribe({
      next: (data) => {
        this.nombreEquipo = data.nombre || this.translate.instant('profile.teamName');
      },
      error: (err) => {
        this.nombreEquipo = this.translate.instant('profile.teamName');
      }
    });
  }

  cargarPerfil() {
    this.userService.getPerfil().subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.nuevoNombreEquipo = data.nombre_equipo || '';
        this.esVIP = data.rol === 'VIP';
        this.esAdmin = data.rol === 'Administrador';
      },
      error: (err) => {
        console.error(err);
        this.error = this.translate.instant('profile.profileLoadError');
      }
    });
  }

  cambiarNombreEquipo() {
    if (!this.nuevoNombreEquipo.trim()) return;

    this.rallyService.cambiarNombreEquipo(this.nuevoNombreEquipo).subscribe({
      next: (data) => {
        this.nombreEquipo = this.nuevoNombreEquipo;
        this.mostrarPopup = false;
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('profile.nameUpdated'),
          text:  this.translate.instant('profile.teamNameChanged'),
          timer: 1000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', this.translate.instant('profile.teamNameChangeError'), 'error');
      }
    });
  }

  cerrarPopup() {
    this.mostrarPopup = false;
  }

  abrirPopupBug() {
    this.mostrarPopupBug = true;
    this.errorEnvio = '';
    this.descripcionBug = '';
    this.reporteEnviado = false;
  }

  cerrarPopupBug() {
    this.mostrarPopupBug = false;
    this.descripcionBug = '';
    this.errorEnvio = '';
  }

  verificarRolUsuario() {
    this.userService.getPerfil().subscribe({
      next: (res) => {
        this.esVIP = res.rol === 'VIP';
        this.esAdmin = res.rol === 'Administrador';
      },
      error: (err) => {
        this.esVIP = false;
        this.esAdmin = false;
      }
    });
  }

  cambiarRol() {
    this.userService.toggleRol().subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('profile.roleChanged'),
          timer: 1000,
          showConfirmButton: false,
        });
        this.cargarPerfil();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', this.translate.instant('profile.roleChangeError'), 'error');
      }
    });
  }

  cambiarAdmin() {
    if (this.esAdmin) {
      this.userService.toggleAdmin({}).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('profile.roleChanged'),
            timer: 1000,
            showConfirmButton: false,
          });
          this.cargarPerfil();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', this.translate.instant('profile.adminRoleChangeError'), 'error');
        }
      });
    } else {
      Swal.fire({
        title: this.translate.instant('profile.adminPasswordTitle'),
        input: 'password',
        inputLabel: this.translate.instant('profile.adminPasswordLabel'),
        inputPlaceholder: this.translate.instant('profile.adminPasswordPlaceholder'),
        confirmButtonText: this.translate.instant('profile.adminPasswordConfirm'),
        showCancelButton: true,
        cancelButtonText: this.translate.instant('profile.adminPasswordCancel'),
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const clave = result.value;
          this.userService.toggleAdmin({ clave }).subscribe({
            next: (res) => {
              Swal.fire({
                icon: 'success',
                title: this.translate.instant('profile.roleChanged'),
                timer: 1000,
                showConfirmButton: false,
              });
              this.cargarPerfil();
            },
            error: (err) => {
              console.error(err);
              const errorMsg = err.error?.mensaje || this.translate.instant('profile.adminRoleChangeError');
              Swal.fire('Error', errorMsg, 'error');
            }
          });
        }
      });
    }
  }

  enviarReporteBug() {
    if (!this.descripcionBug.trim()) {
      this.errorEnvio = this.translate.instant('profile.bugDescriptionPlaceholder');
      return;
    }

    const bug: BugReport = {
      descripcion: this.descripcionBug,
      resuelto: false
    };

    this.bugReportService.enviarReporte(bug).subscribe({
      next: () => {
        this.reporteEnviado = true;
        this.descripcionBug = '';
        this.errorEnvio = '';
        this.cerrarPopupBug();

        Swal.fire({
          icon: 'success',
          title: this.translate.instant('profile.bugReportSent'),
          text: this.translate.instant('profile.bugReportThanks'),
          timer: 1000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.errorEnvio = this.translate.instant('profile.bugReportSendError');
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.translate.instant('profile.bugReportSendError'),
          confirmButtonColor: '#CB7CF8'
        });
      }
    });
  }

  irGestionBugs() {
    this.router.navigate(['/admin/gestion-bugs']);
  }
}
