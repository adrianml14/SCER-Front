import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/users.service';
import { RallyService } from '../../services/rally.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { BugReport, BugReportService } from '../../services/bug-report.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario: any;
  error: string | undefined;
  nuevoNombreEquipo: string = '';
  nombreEquipo: string = 'Mi Equipo';
  mostrarPopupBug: boolean = false;

  mostrarPopup: boolean = false;
  esVIP: boolean = false;
  esAdmin: boolean = false;

  // Para reporte de bug
  descripcionBug: string = '';
  reporteEnviado: boolean = false;
  errorEnvio: string = '';

  constructor(
    private userService: UserService,
    private rallyService: RallyService,
    private equipoService: RallyService,
    private bugReportService: BugReportService,
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.equipoService.getNombreEquipo().subscribe({
      next: (data) => {
        this.nombreEquipo = data.nombre || 'Mi Equipo';
      },
      error: (err) => {
        console.error('Error al obtener el nombre del equipo:', err);
        this.nombreEquipo = 'Mi Equipo';
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
      error: (err: any) => {
        console.error(err);
        this.error = 'No se pudo cargar la información del perfil.';
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
          title: '¡Nombre actualizado!',
          text: data.mensaje || 'El nombre del equipo ha sido cambiado.',
          timer: 1000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cambiar el nombre del equipo.', 'error');
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
        console.error('Error al obtener perfil', err);
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
          title: 'Rol cambiado',
          text: res.mensaje,
          timer: 1000,
          showConfirmButton: false,
        });
        this.cargarPerfil();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cambiar el rol', 'error');
      }
    });
  }

  cambiarAdmin() {
    if (this.esAdmin) {
      this.userService.toggleAdmin({}).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Rol cambiado',
            text: res.mensaje,
            timer: 1000,
            showConfirmButton: false,
          });
          this.cargarPerfil();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo cambiar el rol de administrador', 'error');
        }
      });
    } else {
      Swal.fire({
        title: 'Clave de administrador',
        input: 'password',
        inputLabel: 'Introduce la clave para ser administrador',
        inputPlaceholder: '••••',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const clave = result.value;

          this.userService.toggleAdmin({ clave }).subscribe({
            next: (res) => {
              Swal.fire({
                icon: 'success',
                title: 'Rol cambiado',
                text: res.mensaje,
                timer: 1000,
                showConfirmButton: false,
              });
              this.cargarPerfil();
            },
            error: (err) => {
              console.error(err);
              const errorMsg = err.error?.mensaje || 'No se pudo cambiar el rol de administrador';
              Swal.fire('Error', errorMsg, 'error');
            }
          });
        }
      });
    }
  }

  enviarReporteBug() {
    if (!this.descripcionBug.trim()) {
      this.errorEnvio = 'La descripción no puede estar vacía.';
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
          title: '¡Reporte enviado!',
          text: 'Nos pondremos con él lo antes posible',
          timer: 1000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.errorEnvio = 'Error al enviar el reporte. Intenta de nuevo.';
        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el reporte.',
          confirmButtonColor: '#CB7CF8'
        });
      }
    });
  }
}