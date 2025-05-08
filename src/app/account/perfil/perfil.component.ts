import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/users.service';
import { RallyService } from '../../services/rally.service'; // Asegúrate de importarlo
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

  constructor(
    private userService: UserService,
    private rallyService: RallyService
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
  }

  cambiarNombreEquipo() {
    if (!this.nuevoNombreEquipo.trim()) return;

    console.log('Enviando nombre:', this.nuevoNombreEquipo);

    this.rallyService.cambiarNombreEquipo(this.nuevoNombreEquipo).subscribe({
      next: (data) => {
        Swal.fire('¡Nombre actualizado!', data.mensaje || 'El nombre del equipo ha sido cambiado.', 'success');
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cambiar el nombre del equipo.', 'error');
      }
    });
  }
}
