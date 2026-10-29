import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PeliculasService, Pelicula } from '../../services/peliculas.service';

const MAX_TAMANO_MB = 2;

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.css']
})
export class PeliculasComponent implements OnInit {
  anuncios = signal<Pelicula[]>([]);

  titulo = '';
  sinopsis = '';
  duracion_minutos: number | null= null;
  genero = '';
  clasificacion = '';
  imagenPromocional: string | null = null;
  estado = '';
  guardando = false;

  constructor(private peliculasService: PeliculasService, private router: Router) { }

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  cargarPeliculas(): void {
    this.peliculasService.listar().subscribe({
      next: (lista) => {
        this.anuncios.set(
          [...lista].sort((a, b) =>
            (b.titulo ?? '').localeCompare(a.sinopsis ?? '')
          )
        );
      },
      error: (err) => console.error('Error al cargar anuncios:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > MAX_TAMANO_MB * 1024 * 1024) {
      alert(`La imagen no puede pesar más de ${MAX_TAMANO_MB}MB.`);
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPromocional = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onGuardar(): void {
    if (!this.titulo || !this.sinopsis) {
      alert('Completa título y sinopsis.');
      return;
    }

    this.guardando = true;
    this.peliculasService.guardar({
      titulo: this.titulo,
      sinopsis: this.sinopsis,
      imagenPromocional: this.imagenPromocional
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.titulo = '';
        this.sinopsis = '';
        this.imagenPromocional = null;
        this.cargarPeliculas();
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error al guardar anuncio:', err);
        alert('No se pudo guardar el anuncio.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }

  eliminarPelicula(idPelicula: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta pelicula?')) {
      this.peliculasService.eliminar(idPelicula).subscribe(() => {
        this.cargarPeliculas();
      });
    }
  }
}