import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  idUsuario: number | null = null;   // null = crear, con valor = editar
  estado = 'ACTIVO';

  nombres = '';
  apellidos = '';
  correo = '';
  telefono = '';
  nombreUsuario = '';
  contrasena = '';
  idRolSeleccionado: number | null = null;
  fotografiaBase64: string | null = null;
  guardando = false;


  get editando() { return this.idUsuario !== null; }

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rolService.listar().subscribe({
      next: (lista) => (this.roles = lista),
      error: (err) => console.error('Error al cargar roles:', err)
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idUsuario = Number(id);
      this.usuarioService.obtener(this.idUsuario).subscribe({
        next: (u) => {
          this.nombres = u.nombres;
          this.apellidos = u.apellidos;
          this.correo = u.correo;
          this.telefono = u.telefono;
          this.nombreUsuario = u.nombre_usuario;
          this.idRolSeleccionado = u.rol?.id_rol ?? null;
          this.fotografiaBase64 = u.fotografia;
          this.estado = String(u.estado);
        },
        error: () => { alert('No se pudo cargar el usuario.'); this.cancelar(); }
      });
    }

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
    reader.onload = () => { this.fotografiaBase64 = reader.result as string; };
    reader.readAsDataURL(file);
  }

  onGuardar(): void {
    const faltaPass = !this.editando && !this.contrasena;   // en edición la contraseña es opcional
    if (!this.nombres || !this.apellidos || !this.correo || !this.nombreUsuario || faltaPass || !this.idRolSeleccionado) {
      alert('Completa todos los campos obligatorios, incluyendo el rol.');
      return;
    }

    const datos = {
      nombres: this.nombres,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      nombre_usuario: this.nombreUsuario,
      contrasena: this.contrasena,              // vacío en edición = se conserva la actual

      rol: { id_rol: this.idRolSeleccionado, nombre: '' },
      fotografia: this.fotografiaBase64,
      estado: this.estado                       // importante: si no se envía, el backend lo pone ACTIVO
    };

    this.guardando = true;
    const peticion = this.editando
      ? this.usuarioService.actualizarUsuario(this.idUsuario!, datos)
      : this.usuarioService.guardar(datos);

    peticion.subscribe({
      next: () => { this.guardando = false; this.router.navigate(['/home']); },
      error: (err) => {
        this.guardando = false;
        console.error('Error al guardar usuario:', err);
        alert(this.editando ? 'No se pudo actualizar el usuario.' : 'No se pudo crear el usuario.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}