import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { RolService, Rol } from '../../services/rol.service';

const MAX_TAMANO_MB = 2;

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  roles: Rol[] = [];

  nombres = '';
  apellidos = '';
  correo = '';
  telefono = '';
  nombreUsuario = '';
  contrasena = '';
  idRolSeleccionado: number | null = null;
  fotografiaBase64: string | null = null;
  guardando = false;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rolService.listar().subscribe({
      next: (lista) => (this.roles = lista),
      error: (err) => console.error('Error al cargar roles:', err)
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
    reader.onload = () => {
      this.fotografiaBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onGuardar(): void {
    if (!this.nombres || !this.apellidos || !this.correo || !this.nombreUsuario || !this.contrasena || !this.idRolSeleccionado) {
      alert('Completa todos los campos obligatorios, incluyendo el rol.');
      return;
    }

    this.guardando = true;
    this.usuarioService.guardar({
      nombres: this.nombres,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      nombre_usuario: this.nombreUsuario,
      contrasena: this.contrasena,
      rol: { id_rol: this.idRolSeleccionado, nombre: '' },
      fotografia: this.fotografiaBase64
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error al guardar usuario:', err);
        alert('No se pudo crear el usuario.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}