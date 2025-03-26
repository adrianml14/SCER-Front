import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { ComoJugarComponent } from './como-jugar/como-jugar.component';
/*import { MercadoComponent } from './mercado/mercado.component';
import { LigasComponent } from './ligas/ligas.component';
import { EquipoComponent } from './equipo/equipo.component';*/

@NgModule({
  declarations: [
    ComoJugarComponent,
    /*MercadoComponent,
    LigasComponent,
    EquipoComponent*/
  ],
  imports: [
    CommonModule,
    GameRoutingModule
  ]
})
export class GameModule { }
