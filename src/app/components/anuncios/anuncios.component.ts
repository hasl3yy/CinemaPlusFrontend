import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnuncioService, Anuncio } from '../../services/anuncio.service';

const MAX_TAMANO_MB = 2;

@Component({
  selector: 'app-anuncios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css']
})
export class AnunciosComponent implements OnInit {
  anuncios: Anuncio[] = [];

  titulo = '';
  descripcion = '';
  imagenBase64: string | null = null;
  guardando = false;

  constructor(private anuncioService: AnuncioService, private router: Router) {}

  ngOnInit(): void {
    this.cargarAnuncios();
  }

  cargarAnuncios(): void {
    this.anuncioService.listar().subscribe({
      next: (lista) => {

        this.anuncios = lista.sort((a, b) =>
          (b.fechaPublicacion ?? '').localeCompare(a.fechaPublicacion ?? '')
        );
      },
      error: (err) => console.error('Error al cargar anuncios:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_TAMANO_MB * 1024 * 1024) {
      alert(`La imagen no puede pesar más de ${MAX_TAMANO_MB}MB.`);
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onGuardar(): void {
    if (!this.titulo || !this.descripcion) {
      alert('Completa título y descripción.');
      return;

    }

    this.guardando = true;
    this.anuncioService.guardar({
      titulo: this.titulo,
      descripcion: this.descripcion,
      imagen: this.imagenBase64
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.titulo = '';
        this.descripcion = '';
        this.imagenBase64 = null;
        this.cargarAnuncios();
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
}