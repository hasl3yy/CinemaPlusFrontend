import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionService, Funcion } from '../../services/funcion.service';
import { PeliculasService, Pelicula } from '../../services/peliculas.service';
import { SalaService, Sala } from '../../services/salas.service';

@Component({
  selector: 'app-gestion-funciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-funciones.component.html',
  styleUrls: ['./gestion-funciones.component.css']
})
export class GestionFuncionesComponent implements OnInit {
  funciones = signal<Funcion[]>([]);
  peliculas = signal<Pelicula[]>([]);
  salas = signal<Sala[]>([]);

  idFuncion: number | null = null;   // null = crear
  estado = 'ACTIVO';
  idPelicula: number | null = null;
  idSala: number | null = null;
  fecha = '';
  hora = '';
  precio: number | null = null;
  guardando = false;

  constructor(
    private funcionService: FuncionService,
    private peliculasService: PeliculasService,

    private salaService: SalaService,
    private router: Router
  ) {}

  get editando() { return this.idFuncion !== null; }

  ngOnInit(): void {
    this.peliculasService.listar().subscribe(l => this.peliculas.set(l.filter(p => p.estado === 'ACTIVO')));
    this.salaService.listar().subscribe(l => this.salas.set(l.filter(s => s.estado === 'ACTIVO')));
    this.cargar();
  }

  cargar() {
    this.funcionService.listar().subscribe({
      next: l => this.funciones.set([...l].sort((a, b) =>
        (b.fecha + b.hora).localeCompare(a.fecha + a.hora))),
      error: e => console.error('Error al cargar funciones:', e)
    });
  }

  editar(f: Funcion) {
    this.idFuncion = f.id_funcion;
    this.estado = f.estado;
    this.idPelicula = f.pelicula?.id_pelicula ?? null;
    this.idSala = f.sala?.id_sala ?? null;
    this.fecha = f.fecha;
    this.hora = f.hora.slice(0, 5);
    this.precio = f.precio_entrada;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  limpiar() {

    this.idFuncion = null;
    this.estado = 'ACTIVO';
    this.idPelicula = null;
    this.idSala = null;
    this.fecha = '';
    this.hora = '';
    this.precio = null;
  }

  onGuardar() {
    if (!this.idPelicula || !this.idSala || !this.fecha || !this.hora || !this.precio || this.precio <= 0) {
      alert('Completa película, sala, fecha, hora y precio.');
      return;
    }
    this.guardando = true;
    const body: any = {
      pelicula: { id_pelicula: this.idPelicula },
      sala: { id_sala: this.idSala },
      fecha: this.fecha,
      hora: this.hora + ':00',
      precio_entrada: this.precio,
      estado: this.estado
    };
    if (this.idFuncion) body.id_funcion = this.idFuncion;

    this.funcionService.guardar(body).subscribe({
      next: () => { this.guardando = false; this.limpiar(); this.cargar(); },
      error: e => { this.guardando = false; alert(e.error || 'No se pudo guardar la función.'); }
    });
  }

  activar(id: number) {

    this.funcionService.activar(id).subscribe(() => this.cargar());
  }

  desactivar(id: number) {
    if (confirm('¿Desactivar esta función?')) {
      this.funcionService.desactivar(id).subscribe(() => this.cargar());
    }
  }

  volver() { this.router.navigate(['/home']); }
}