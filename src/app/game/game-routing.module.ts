import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComoJugarComponent } from './como-jugar/como-jugar.component';
import { MercadoComponent } from './mercado/mercado.component';
import { LigasComponent } from './ligas/ligas.component';
import { MiEquipoComponent } from './mi-equipo/mi-equipo.component';

const routes: Routes = [
  { path: 'como-jugar', component: ComoJugarComponent },
  { path: 'mercado', component: MercadoComponent },
  { path: 'ligas', component: LigasComponent },
  { path: 'mi-equipo', component: MiEquipoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
