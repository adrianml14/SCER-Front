import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GameRoutingModule } from './game-routing.module';
import { ComoJugarComponent } from './como-jugar/como-jugar.component';
// import { MercadoComponent } from './mercado/mercado.component';
// import { LigasComponent } from './ligas/ligas.component';
// import { EquipoComponent } from './equipo/equipo.component';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
    HttpClientModule,
    ComoJugarComponent,
    // MercadoComponent, 
    // LigasComponent,  
    // EquipoComponent, 
  ]
})
export class GameModule { }
