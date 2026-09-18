import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AnunciosComponent } from './components/anuncios/anuncios.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'anuncios', component: AnunciosComponent },
  { path: 'usuarios/nuevo', component: CrearUsuarioComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];