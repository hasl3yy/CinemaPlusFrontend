import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importa esto
import { ActivatedRoute, Router } from '@angular/router';
import { Fila, FilaService } from '../../services/fila.service';

@Component({
    selector: 'app-filas',
    templateUrl: './filas.component.html',
    styleUrls: ['./filas.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule] // <-- Agrégalo aquí
})
export class FilasComponent implements OnInit {
    idSala!: number;
    filas: any[] = [];
    estado = 'ACTIVO';



    idFilaEditando: number | null = null;
    nuevaFila: { nombre: string; cantidad_de_asientos: number | null; sala: { id_sala: number } } = {
        nombre: '',
        cantidad_de_asientos: null,
        sala: { id_sala: 0 }
    };

    get editando() { return this.idFilaEditando !== null; }

    cantidad_de_asientos: number | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private filaService: FilaService
    ) { }

    ngOnInit(): void {
        this.idSala = Number(this.route.snapshot.paramMap.get('id'));
        this.nuevaFila.sala.id_sala = this.idSala;
        this.cargarFilas();
    }

    cargarFilas() {
        this.filaService.listaPorSala(this.idSala).subscribe((filas: any[]) => {
            this.filas = filas;
        });
    }

    guardarFila() {
        if (!this.nuevaFila.nombre || !this.nuevaFila.cantidad_de_asientos) {
            alert('Completa todos los campos.');
            return;
        }

        const body: any = { ...this.nuevaFila };
        if (this.idFilaEditando) {
            body.id_fila = this.idFilaEditando;     // con id = edición, sin id = creación
        }

        this.filaService.guardar(body).subscribe({
            next: () => {
                this.cancelarEdicion();
                this.cargarFilas();
            },
            error: (err) => alert(err.error || 'No se pudo guardar la fila.')
        });
    }



    eliminarFila(idFila: number) {
        if (confirm('¿Estás seguro de que deseas eliminar esta fila?')) {
            this.filaService.eliminar(idFila).subscribe(() => {
                this.cargarFilas();
            });
        }
    }

    regresar() {
        this.router.navigate(['/salas/nuevo']); // Ajusta la ruta de tu lista de salas según tu app.routes
    }

    editarFila(f: any) {
        this.idFilaEditando = f.id_fila;
        this.nuevaFila = {
            nombre: f.nombre,
            cantidad_de_asientos: f.cantidad_de_asientos,
            sala: { id_sala: this.idSala }
        };
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelarEdicion() {
        this.idFilaEditando = null;
        this.nuevaFila = {
            nombre: '',
            cantidad_de_asientos: null,
            sala: { id_sala: this.idSala }
        };
    }

    limpiar() {
        this.idFilaEditando = null;
        this.nuevaFila.nombre = '';
        this.nuevaFila.cantidad_de_asientos = null;

    }
}