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
  filas = 0;
  asientos_por_fila = 0;
  estado = false;

  constructor(private SalaService: SalaService,private router: Router) { }

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
    if (!this.nombre || !this.filas || !this.asientos_por_fila) {
      alert('Completa todos los campos.');
      return;
    }

    this.estado = true;
    this.SalaService.guardar({
      nombre: this.nombre,
      filas: this.filas,
      asientos_por_fila: this.asientos_por_fila,
    }).subscribe({
      next: () => {
        this.nombre = '';
        this.filas = 0;
        this.asientos_por_fila = 0;
        this.estado = false;
        this.cargarSalas();
      },
      error: (err) => {
        this.estado = false;
        console.error('Error al guardar sala:', err);
        alert('No se pudo guardar la sala.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }
}
