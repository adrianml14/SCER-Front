import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-mercado',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatTabsModule, MatButtonModule],
  templateUrl: './mercado.component.html',
  styleUrl: './mercado.component.css',
})
export class MercadoComponent implements OnInit {
  private rallyService = inject(RallyService);

  pilotos: any[] = [];
  copilotos: any[] = [];
  coches: any[] = [];

  elementoSeleccionado: any = null;
  tipoSeleccionado: 'piloto' | 'copiloto' | 'coche' | null = null;

  ngOnInit(): void {
    this.rallyService.getPilotos().subscribe(data => this.pilotos = data);
    this.rallyService.getCopilotos().subscribe(data => this.copilotos = data);
    this.rallyService.getCoches().subscribe(data => this.coches = data);
  }

  abrirPopup(tipo: 'piloto' | 'copiloto' | 'coche', item: any) {
    this.tipoSeleccionado = tipo;
    this.elementoSeleccionado = item;
  }

  cerrarPopup() {
    this.elementoSeleccionado = null;
    this.tipoSeleccionado = null;
  }

  contratar() {
    console.log('Contratando:', this.elementoSeleccionado);
    this.cerrarPopup();
  }

  comprar() {
    console.log('Comprando:', this.elementoSeleccionado);
    this.cerrarPopup();
  }
}
