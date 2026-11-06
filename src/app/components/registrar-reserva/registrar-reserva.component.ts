import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { CajaService } from '../../services/caja.service';

@Component({
  selector: 'app-registrar-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-reserva.component.html',
  styleUrls: ['./registrar-reserva.component.css']
})
export class RegistrarReservaComponent implements OnInit {
  funciones = signal<any[]>([]);
  filas = signal<{ nombre: string; asientos: any[] }[]>([]);
  ocupados = signal<number[]>([]);
  seleccionados = signal<number[]>([]);
  reservas = signal<any[]>([]);

  idFuncion: number | null = null;
  nit = '';
  cantidad = 1;
  precio = 0;
  guardando = false;

  constructor(private caja: CajaService, private router: Router) {}

  ngOnInit(): void {
    this.caja.funcionesActivas().subscribe(f => this.funciones.set(f));
    this.cargarReservas();
  }

  cargarReservas() {
    this.caja.reservas().subscribe(r =>
      this.reservas.set([...r].sort((a, b) => (b.fecha_reserva ?? '').localeCompare(a.fecha_reserva ?? ''))));
  }

  onFuncionChange() {
    this.seleccionados.set([]);
    const f = this.funciones().find(x => x.id_funcion === this.idFuncion);
    if (!f) return;
    this.precio = f.precio_entrada;

    this.caja.asientosPorSala(f.sala.id_sala).subscribe(lista => this.armarMapa(lista));
    this.caja.ocupados(f.id_funcion).subscribe(o => {
      this.ocupados.set(o);
      this.sugerir();
    });
  }

  private armarMapa(lista: any[]) {
    const mapa = new Map<string, any[]>();
    for (const a of lista) {
      const n = a.fila?.nombre ?? '?';
      if (!mapa.has(n)) mapa.set(n, []);
      mapa.get(n)!.push(a);
    }
    this.filas.set([...mapa.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([nombre, asientos]) => ({ nombre, asientos: asientos.sort((x, y) => x.numero - y.numero) })));
  }

  // Asignación automática (el cajero luego puede cambiarla en el mapa)
  sugerir() {
    if (!this.idFuncion || this.cantidad < 1) return;
    this.caja.sugerir(this.idFuncion, this.cantidad).subscribe({
      next: ids => this.seleccionados.set(ids),
      error: e => { this.seleccionados.set([]); alert(e.error || 'No hay asientos suficientes.'); }
    });
  }

  isOcupado(a: any) { return this.ocupados().includes(a.id_asiento); }
  isSeleccionado(a: any) { return this.seleccionados().includes(a.id_asiento); }

  toggle(a: any) {
    if (this.isOcupado(a)) return;
    this.seleccionados.update(s =>
      s.includes(a.id_asiento) ? s.filter(id => id !== a.id_asiento) : [...s, a.id_asiento]);
    this.cantidad = this.seleccionados().length;
  }

  get total() { return this.seleccionados().length * this.precio; }

  private obtenerCliente(nit: string): Observable<any> {
    return this.caja.clientePorNit(nit).pipe(
      catchError(err => err.status === 404
        ? this.caja.crearCliente({ nit, nombres: 'Consumidor', apellidos: 'Final' })
        : throwError(() => err))
    );
  }

  confirmar() {
    if (!this.idFuncion || !this.nit.trim() || !this.seleccionados().length) {
      alert('Selecciona función, NIT y al menos un asiento.');
      return;
    }
    this.guardando = true;
    this.obtenerCliente(this.nit.trim()).pipe(
      switchMap(c => this.caja.reservar({
        id_cliente: c.id_cliente,
        id_funcion: this.idFuncion!,
        id_asiento: this.seleccionados()
      }))
    ).subscribe({
      next: () => {
        this.guardando = false;
        alert('Reserva registrada');
        this.nit = '';
        this.seleccionados.set([]);
        this.caja.ocupados(this.idFuncion!).subscribe(o => { this.ocupados.set(o); this.sugerir(); });
        this.cargarReservas();
      },
      error: e => { this.guardando = false; alert(e.error || 'No se pudo registrar la reserva.'); }
    });
  }

  volver() { this.router.navigate(['/home']); }
}