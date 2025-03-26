import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', loadChildren: () => import('./game/game.module').then(m => m.GameModule) },
  { path: '', redirectTo: '/game/como-jugar', pathMatch: 'full' },
  { path: '**', redirectTo: '/game/como-jugar' } ,
];
