import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AnunciosComponent } from './components/anuncios/anuncios.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { SalasComponent } from './components/salas/salas.component';
import { FilasComponent } from './components/filas/filas.component';
import { PeliculasComponent } from './components/peliculas/peliculas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'anuncios', component: AnunciosComponent },
  { path: 'peliculas', component: PeliculasComponent },
  { path: 'usuarios/nuevo', component: CrearUsuarioComponent },
  { path: 'salas/nuevo', component: SalasComponent },
  { path: 'salas/:id/filas', component: FilasComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];