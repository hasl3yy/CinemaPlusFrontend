import { Routes } from '@angular/router';
import { rolGuard } from './guards/rol.guard';
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
import { sesionGuard } from './guards/sesion.guard';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
{ path: 'home', component: HomeComponent, canActivate: [sesionGuard] },

{ path: 'perfil', component: PerfilComponent, canActivate: [sesionGuard] },

  // ADMINISTRADOR: usuarios y salas
  { path: 'usuarios/nuevo',       component: CrearUsuarioComponent, canActivate: [rolGuard('administrador')] },
  { path: 'usuarios/editar/:id',  component: CrearUsuarioComponent, canActivate: [rolGuard('administrador')] },
  { path: 'salas/nuevo',          component: SalasComponent,        canActivate: [rolGuard('administrador')] },
  { path: 'salas/:id/filas',      component: FilasComponent,        canActivate: [rolGuard('administrador')] },

  // GERENTE: películas, funciones, anuncios (y reportes)
  { path: 'peliculas',  component: PeliculasComponent,        canActivate: [rolGuard('gerente')] },
  { path: 'funciones',  component: GestionFuncionesComponent, canActivate: [rolGuard('gerente')] },
  { path: 'anuncios',   component: AnunciosComponent,         canActivate: [rolGuard('gerente')] },
  { path: 'reportes',   component: ReportesComponent,         canActivate: [rolGuard('gerente')] },

  // CAJERO: reservas presenciales
  { path: 'reservas/nueva', component: RegistrarReservaComponent, canActivate: [rolGuard('cajero')] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];