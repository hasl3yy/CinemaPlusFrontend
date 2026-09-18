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
    this.router.navigate(['/login']);
  }

  irAAnuncios(): void {
    this.router.navigate(['/anuncios']);
  }

  irACrearUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }
}