import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-mercado',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatTabsModule, MatButtonModule],
  templateUrl: './mercado.component.html',
  styleUrl: './mercado.component.css',
})
export class MercadoComponent implements OnInit {
  private rallyService = inject(RallyService);
  presupuesto: number | null = null;


  pilotos: any[] = [];
  copilotos: any[] = [];
  coches: any[] = [];

  elementoSeleccionado: any = null;
  tipoSeleccionado: 'piloto' | 'copiloto' | 'coche' | null = null;

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
  }

  comprar() {
    if (this.elementoSeleccionado && this.tipoSeleccionado) {
      this.rallyService.comprarElemento(this.tipoSeleccionado, this.elementoSeleccionado.id).subscribe({
        next: (data) => {
          Swal.fire({
            title: data.mensaje,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true,
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
          alert('No se pudo realizar la compra.');
        }
      });
    }
  }

  cargarMercadoFiltrado() {
    // Primero obtenemos los elementos del equipo del usuario
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

}
