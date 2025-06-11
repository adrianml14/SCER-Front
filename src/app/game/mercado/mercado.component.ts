import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mercado',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatTabsModule, MatButtonModule, TranslateModule],
  templateUrl: './mercado.component.html',
  styleUrl: './mercado.component.css',
})
export class MercadoComponent implements OnInit {
  private rallyService = inject(RallyService);
  presupuesto: number | null = null;
  historialElemento: any[] = [];
  mostrarHistorial = false;

  pilotos: any[] = [];
  copilotos: any[] = [];
  coches: any[] = [];

  elementoSeleccionado: any = null;
  tipoSeleccionado: 'piloto' | 'copiloto' | 'coche' | null = null;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.cargarMercadoFiltrado();
    this.cargarPresupuesto();
  }

  cargarPresupuesto() {
    this.rallyService.getPresupuesto().subscribe({
      next: data => this.presupuesto = data.presupuesto,
      error: err => console.error('Error al cargar presupuesto:', err)
    });
  }

  abrirPopup(tipo: 'piloto' | 'copiloto' | 'coche', item: any) {
    this.tipoSeleccionado = tipo;
    this.elementoSeleccionado = item;
  }

  cerrarPopup() {
    this.cargarMercadoFiltrado();
    this.elementoSeleccionado = null;
    this.tipoSeleccionado = null;
    this.mostrarHistorial = false;
    this.historialElemento = [];
  }

  comprar() {
    if (this.elementoSeleccionado && this.tipoSeleccionado) {
      this.rallyService.comprarElemento(this.tipoSeleccionado, this.elementoSeleccionado.id).subscribe({
        next: (data) => {
          Swal.fire({
            title: this.translate.instant('market.buySuccess'),
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            draggable: true
          });

          switch (this.tipoSeleccionado) {
            case 'piloto':
              this.rallyService.getPilotos().subscribe(data => this.pilotos = data);
              break;
            case 'copiloto':
              this.rallyService.getCopilotos().subscribe(data => this.copilotos = data);
              break;
            case 'coche':
              this.rallyService.getCoches().subscribe(data => this.coches = data);
              break;
          }

          this.cerrarPopup();
          this.cargarPresupuesto();
        },
        error: (err) => {
          console.error('Error al comprar:', err);
          const mensaje = err?.error?.error || this.translate.instant('market.buyErrorMessage');
          Swal.fire({
            title: this.translate.instant('market.buyErrorTitle'),
            text: mensaje,
            icon: 'error',
            confirmButtonText: this.translate.instant('market.buyErrorButton')
          });
        }
      });
    }
  }

  cargarMercadoFiltrado() {
    let misPilotosIds: number[] = [];
    let misCopilotosIds: number[] = [];
    let misCochesIds: number[] = [];

    this.rallyService.getMisPilotos().subscribe(misPilotos => {
      misPilotosIds = misPilotos.map((p: any) => p.id);

      this.rallyService.getPilotos().subscribe(pilotos => {
        this.pilotos = pilotos.filter((p: any) => !misPilotosIds.includes(p.id));
      });
    });

    this.rallyService.getMisCopilotos().subscribe(misCopilotos => {
      misCopilotosIds = misCopilotos.map((c: any) => c.id);

      this.rallyService.getCopilotos().subscribe(copilotos => {
        this.copilotos = copilotos.filter((c: any) => !misCopilotosIds.includes(c.id));
      });
    });

    this.rallyService.getMisCoches().subscribe(misCoches => {
      misCochesIds = misCoches.map((c: any) => c.id);

      this.rallyService.getCoches().subscribe(coches => {
        this.coches = coches.filter((c: any) => !misCochesIds.includes(c.id));
      });
    });
  }

  cargarHistorialElemento() {
    if (!this.elementoSeleccionado || !this.tipoSeleccionado) return;

    let request;
    if (this.tipoSeleccionado === 'piloto') {
      request = this.rallyService.getHistoricoPiloto(this.elementoSeleccionado.id);
    } else if (this.tipoSeleccionado === 'copiloto') {
      request = this.rallyService.getHistoricoCopiloto(this.elementoSeleccionado.id);
    } else if (this.tipoSeleccionado === 'coche') {
      request = this.rallyService.getHistoricoCoche(this.elementoSeleccionado.id);
    }

    if (request) {
      request.subscribe({
        next: (data) => {
          this.historialElemento = data;
          this.mostrarHistorial = !this.mostrarHistorial;
        },
        error: (err) => {
          console.error('Error cargando historial:', err);
          this.historialElemento = [];
          this.mostrarHistorial = false;
        }
      });
    }
  }
}
