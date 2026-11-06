import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AnunciosComponent } from './components/anuncios/anuncios.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { SalasComponent } from './components/salas/salas.component';
import { FilasComponent } from './components/filas/filas.component';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { RegistrarReservaComponent } from './components/registrar-reserva/registrar-reserva.component';
import { GestionFuncionesComponent } from './components/gestion-funciones/gestion-funciones.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'anuncios', component: AnunciosComponent },
  { path: 'peliculas', component: PeliculasComponent },
  { path: 'reservas/nueva', component: RegistrarReservaComponent },
  { path: 'usuarios/nuevo', component: CrearUsuarioComponent },
  { path: 'salas/nuevo', component: SalasComponent },
  { path: 'funciones', component: GestionFuncionesComponent },
  { path: 'usuarios/editar/:id', component: CrearUsuarioComponent },
  { path: 'salas/:id/filas', component: FilasComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];