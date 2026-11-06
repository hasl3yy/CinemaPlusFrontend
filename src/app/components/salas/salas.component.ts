import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaService, Sala } from '../../services/salas.service';


@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css']
})

export class SalasComponent implements OnInit {

  salas = signal<Sala[]>([]);
  nombre = '';
  cargando = false;
   estado = 'ACTIVO';

  idSala: number | null = null;

  constructor(private SalaService: SalaService, private router: Router) { }

  ngOnInit(): void {
    this.cargarSalas();
  }

  cargarSalas(): void {
    this.SalaService.listar().subscribe({
      next: (lista) => {
        this.salas.set(
          [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre))
        );
      },
      error: (err) => console.error('Error al cargar salas:', err)
    });
  }

 

  onGuardar(): void {
    if (!this.nombre.trim()) {
      alert('Completa el nombre de la sala.');
      return;
    }
  
    this.cargando = true;
    const body: Partial<Sala> = {
      nombre: this.nombre,
      estado: this.estado
    };
  
    if (this.idSala) {                       // <-- si está editando, manda el id
      body.id_sala = this.idSala;
      body.nombre = this.nombre;
    }
  
    this.SalaService.guardar(body).subscribe({
      next: () => {
        this.cargando = false;
        this.limpiar();
        this.cargarSalas();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al guardar sala:', err);
        alert('No se pudo guardar la sala.');
      }
    });
  }

  limpiar() {
  this.idSala = null;
  this.nombre = '';
}

  administrarFilas(idSala: number): void {
    this.router.navigate(['/salas', idSala, 'filas']);
  }


  activarSala(idSala: number): void {
    if (confirm('¿Estás seguro de que deseas activar esta sala?')) {
      this.SalaService.activar(idSala).subscribe({
        next: (response) => {
          // Aquí actualizas tu lista de salas o recargas los datos para que refleje el cambio
          this.cargarSalas();
        },
        error: (err) => {
          console.error('Error al activar la sala', err);
        }
      });
    }
  }


  desactivarSala(idSala: number): void {
    if (confirm('¿Estás seguro de que deseas desactivar esta sala?')) {
      this.SalaService.desactivar(idSala).subscribe({
        next: (response) => {
          // Aquí actualizas tu lista de salas o recargas los datos para que refleje el cambio
          this.cargarSalas();
        },
        error: (err) => {
          console.error('Error al desactivar la sala', err);
        }
      });
    }
  }

  editar(f: Sala) {
    this.idSala = f.id_sala;
    this.nombre = f.nombre
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }
}
