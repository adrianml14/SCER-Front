import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GameRoutingModule } from './game-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ComoJugarComponent } from './como-jugar/como-jugar.component';
import { MercadoComponent } from './mercado/mercado.component';
import { LigasComponent } from './ligas/ligas.component';
import { MiEquipoComponent } from './mi-equipo/mi-equipo.component';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
    HttpClientModule,
    ComoJugarComponent,
    MercadoComponent, 
    LigasComponent,  
    MiEquipoComponent,
    MatToolbarModule,
    MatButtonToggleModule,
  ]
})
export class GameModule { }
