import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  usuario: Usuario | null = null;
  usuarios = signal<Usuario[]>([]);

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.usuario = this.authService.getUsuarioActual();
  }

  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: (lista) => {
        this.usuarios.set(
          [...lista].sort((a, b) => a.nombres.localeCompare(b.nombres))
        );
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  irAAnuncios(): void {
    this.router.navigate(['/anuncios']);
  }

    irAPeliculas(): void {
    this.router.navigate(['/peliculas']);
  }

  irACrearUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  irACrearSala(): void {
    this.router.navigate(['/salas/nuevo']);
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (lista) => {
        this.usuarios.set(
          [...lista].sort((a, b) => a.nombres.localeCompare(b.nombres))
        );
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  desactivarUsuario(idUsuario: number): void {
    if (confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      this.usuarioService.desactivarUsuario(idUsuario).subscribe({
        next: (response) => {

          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al desactivar el usuario', err);
        }
      });
    }
  }

  activarUsuario(idUsuario: number): void {
    if (confirm('¿Estás seguro de que deseas activar este usuario?')) {
      this.usuarioService.activarUsuario(idUsuario).subscribe({
        next: (response) => {

          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al activar el usuario', err);
        }
      });
    }
  }
}