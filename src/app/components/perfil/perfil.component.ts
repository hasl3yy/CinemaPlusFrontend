import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

const MAX_TAMANO_MB = 2;

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['../crear-usuario/crear-usuario.component.css']   // reutilizamos los estilos del formulario
})
export class PerfilComponent implements OnInit {
  idUsuario = 0;
  rol = '';

  nombres = '';
  apellidos = '';
  correo = '';
  telefono = '';
  nombreUsuario = '';
  fotografia: string | null = null;

  actual = '';
  nueva = '';
  confirmar = '';

  guardando = false;


  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const u = this.authService.getUsuarioActual();
    if (!u) {
      this.router.navigate(['/login']);
      return;
    }
    this.idUsuario = u.id_usuario;

    this.usuarioService.obtener(this.idUsuario).subscribe({
      next: (d) => {
        this.nombres = d.nombres;
        this.apellidos = d.apellidos;
        this.correo = d.correo;
        this.telefono = d.telefono;
        this.nombreUsuario = d.nombre_usuario;
        this.fotografia = d.fotografia;
        this.rol = d.rol?.nombre ?? '';
      },
      error: () => alert('No se pudo cargar tu perfil.')
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (file.size > MAX_TAMANO_MB * 1024 * 1024) {
      alert(`La foto no puede pesar más de ${MAX_TAMANO_MB}MB.`);
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { this.fotografia = reader.result as string; };
    reader.readAsDataURL(file);
  }

  guardar(): void {
    if (!this.nombres.trim() || !this.apellidos.trim() || !this.correo.trim() || !this.nombreUsuario.trim()) {
      alert('Nombres, apellidos, correo y nombre de usuario son obligatorios.');
      return;
    }

    this.guardando = true;
    this.usuarioService.actualizarPerfil(this.idUsuario, {
      nombres: this.nombres,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      nombre_usuario: this.nombreUsuario,
      fotografia: this.fotografia
    }).subscribe({
      next: (u) => {
        this.guardando = false;
        localStorage.setItem('usuario', JSON.stringify(u));   // el home muestra los datos nuevos
        alert('Datos actualizados');
      },

      error: () => {
        this.guardando = false;
        alert('No se pudieron guardar los cambios.');
      }
    });
  }

  cambiarContrasena(): void {
    if (!this.actual || !this.nueva) {
      alert('Escribe la contraseña actual y la nueva.');
      return;
    }
    if (this.nueva !== this.confirmar) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }

    this.usuarioService.cambiarContrasena(this.idUsuario, this.actual, this.nueva).subscribe({
      next: () => {
        alert('Contraseña actualizada');
        this.actual = this.nueva = this.confirmar = '';
      },
      error: (err) => alert(err.error || 'No se pudo cambiar la contraseña.')
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }
}