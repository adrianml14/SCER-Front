import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LigasService } from '../../services/ligas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-liga-detalle',
  imports: [CommonModule],
  templateUrl: './liga-detalle.component.html',
  styleUrls: ['./liga-detalle.component.css']
})
export class LigaDetalleComponent implements OnInit {
  ligaId: string | null = '';
  participantes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private ligasService: LigasService,
    private router: Router // Inyectamos Router para el botón "Volver"
  ) {}

  

  ngOnInit(): void {
    this.ligaId = this.route.snapshot.paramMap.get('id'); // Obtenemos el ID de la liga desde la URL
    
    if (this.ligaId) {
      // Obtenemos los participantes de la liga
      this.ligasService.obtenerParticipantes(+this.ligaId).subscribe((data) => {
        // Ordenamos los participantes por puntos (de mayor a menor)
        this.participantes = data.sort((a: any, b: any) => b.puntos - a.puntos);
      });
    }
  }

  // Función para volver a la lista de ligas
  volver() {
    this.router.navigate(['/game/ligas']); // Redirige a la ruta de ligas
  }
}
