import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { BugReport, BugReportService } from '../../services/bug-report.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-bugs',
  templateUrl: './gestion-bugs.component.html',
  styleUrls: ['./gestion-bugs.component.css'],
  standalone: true,   // Solo si usas standalone components
  imports: [CommonModule, NgIf, NgFor, NgClass], // Importa los módulos/directivas
})
export class GestionBugsComponent implements OnInit {
  bugs: BugReport[] = [];
  cargando = false;

  constructor(private bugService: BugReportService) {}

  ngOnInit(): void {
    this.cargarBugs();
  }

  cargarBugs() {
    this.cargando = true;
    this.bugService.obtenerTodos().subscribe({
      next: (data) => {
        this.bugs = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los bugs.',
          timer: 1000,
          showConfirmButton: false
        });
      }
    });
  }

  eliminarBug(id: number) {
    Swal.fire({
      title: '¿Eliminar reporte?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bugService.eliminarBug(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              timer: 1000,
              showConfirmButton: false
            });
            this.cargarBugs();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el reporte.',
              timer: 1000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }

  toggleResuelto(bug: BugReport) {
    this.bugService.cambiarEstadoResuelto(bug.id!, !bug.resuelto).subscribe({
      next: () => {
        bug.resuelto = !bug.resuelto;
        Swal.fire({
          icon: 'success',
          title: `Marcado como ${bug.resuelto ? 'resuelto' : 'pendiente'}`,
          timer: 1000,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cambiar el estado del bug.',
          timer: 1000,
          showConfirmButton: false
        });
      }
    });
  }
}
