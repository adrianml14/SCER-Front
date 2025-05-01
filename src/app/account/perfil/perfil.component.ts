import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario: any;
  error: string | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getPerfil().subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'No se pudo cargar la información del perfil.';
      }
    });
  }
}
