import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LigasService } from '../../services/ligas.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-liga-detalle',
  imports: [CommonModule, TranslateModule],
  templateUrl: './liga-detalle.component.html',
  styleUrls: ['./liga-detalle.component.css']
})
export class LigaDetalleComponent implements OnInit {
  ligaId: string | null = '';
  participantes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private ligasService: LigasService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.ligaId = this.route.snapshot.paramMap.get('id');

    if (this.ligaId) {
      this.ligasService.obtenerParticipantes(+this.ligaId).subscribe((data) => {
        // Ordenamos de mayor a menor
        const ordenados = data.sort((a: any, b: any) => b.puntos - a.puntos);

        let posicion = 1;
        let anterioresPuntos: number | null = null;
        let contador = 1;

        this.participantes = ordenados.map((participante: any, index: number) => {
          if (participante.puntos !== anterioresPuntos) {
            posicion = contador;
            anterioresPuntos = participante.puntos;
          }

          contador += 1;

          return {
            ...participante,
            posicion: posicion
          };
        });
      });
    }
  }

  // Función para volver a la lista de ligas
  volver() {
    this.router.navigate(['/game/ligas']);
  }
}
