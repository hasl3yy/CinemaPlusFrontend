import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CajaService {
  private api = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  funcionesActivas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/funcion/activos`);
  }
  asientosPorSala(idSala: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/asiento/buscar/sala/${idSala}`);
  }
  ocupados(idFuncion: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.api}/detallereservaasientos/ocupados/${idFuncion}`);
  }
  sugerir(idFuncion: number, cantidad: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.api}/reserva/sugerir/${idFuncion}/${cantidad}`);
  }
  clientePorNit(nit: string): Observable<any> {
    return this.http.get<any>(`${this.api}/cliente/nit/${encodeURIComponent(nit)}`);
  }
  crearCliente(c: any): Observable<any> {
    return this.http.post<any>(`${this.api}/cliente/guardar`, c);
  }
  reservar(p: { id_cliente: number; id_funcion: number; id_asiento: number[] }): Observable<any> {
    return this.http.post<any>(`${this.api}/reserva/reservar`, p);
  }
  reservas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/reserva/buscar`);

  }
}