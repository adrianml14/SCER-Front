import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/users.service';
import { RallyService } from '../../services/rally.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

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

  mostrarPopup: boolean = false;


  constructor(
    private userService: UserService,
    private rallyService: RallyService,
    private equipoService: RallyService
  ) {}

  ngOnInit(): void {
    this.userService.getPerfil().subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.nuevoNombreEquipo = data.nombre_equipo || '';
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'No se pudo cargar la información del perfil.';
      }
    });

          // Obtener nombre del equipo
      this.equipoService.getNombreEquipo().subscribe({
        next: (data) => {
          console.log('Nombre del equipo recibido:', data.nombre); // Verifica lo que se recibe
          this.nombreEquipo = data.nombre || 'Mi Equipo';
        },
        error: (err) => {
          console.error('Error al obtener el nombre del equipo:', err);
          this.nombreEquipo = 'Mi Equipo'; // Valor por defecto en caso de error
        }
      });
  }

cambiarNombreEquipo() {
  if (!this.nuevoNombreEquipo.trim()) return;

  this.rallyService.cambiarNombreEquipo(this.nuevoNombreEquipo).subscribe({
    next: (data) => {
      this.nombreEquipo = this.nuevoNombreEquipo; // Actualiza el nombre en la vista
      this.mostrarPopup = false;
      Swal.fire('¡Nombre actualizado!', data.mensaje || 'El nombre del equipo ha sido cambiado.', 'success');
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

}
