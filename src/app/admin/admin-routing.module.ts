import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionBugsComponent } from './gestion-bugs/gestion-bugs.component';

const routes: Routes = [
  { path: 'gestion-bugs', component: GestionBugsComponent },
  // aquí puedes añadir más rutas admin si quieres
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
