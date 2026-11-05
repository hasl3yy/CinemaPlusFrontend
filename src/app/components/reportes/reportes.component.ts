import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReporteService, ReporteVentas } from '../../services/reporte.service';


@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.css']
})

export class ReportesComponent implements OnInit {
    reporte = signal<ReporteVentas | null>(null);
    desde = '';
    hasta = '';



    constructor(private reporteService: ReporteService, private router: Router) { }

    ngOnInit() { this.consultar(); }

    consultar() {
        this.reporteService.ventas(this.desde, this.hasta).subscribe({
            next: r => this.reporte.set(r),
            error: e => console.error('Error al cargar reporte:', e)
        });
    }

    limpiar() { this.desde = ''; this.hasta = ''; this.consultar(); }

    volver(): void {
        this.router.navigate(['/home']);
    }
}