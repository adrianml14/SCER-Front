import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComoJugarComponent } from './como-jugar/como-jugar.component';
/*import { MercadoComponent } from './mercado/mercado.component';
import { LigasComponent } from './ligas/ligas.component';
import { EquipoComponent } from './equipo/equipo.component';*/

const routes: Routes = [
  { path: 'como-jugar', component: ComoJugarComponent },
  /*{ path: 'mercado', component: MercadoComponent },
  { path: 'ligas', component: LigasComponent },
  { path: 'equipo', component: EquipoComponent },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
