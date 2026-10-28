import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importa esto
import { ActivatedRoute, Router } from '@angular/router';
import { FilaService } from '../../services/fila.service';

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

    nuevaFila = {
        nombre: '',
        cantidad_de_asientos: null,
        sala: { id_sala: 0 }
    };

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
        // Agregamos 'as any' para que TypeScript ignore la validación estricta de la interfaz
        this.filaService.guardar(this.nuevaFila as any).subscribe(() => {
            this.cargarFilas();
            this.nuevaFila = { ...this.nuevaFila, nombre: '', cantidad_de_asientos: null };
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
}