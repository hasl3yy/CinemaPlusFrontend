import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface VentaPelicula { id_pelicula: number; titulo: string; entradas: number; ingresos: number; }
export interface VentaFuncion { id_funcion: number; titulo: string; sala: string; fecha: string; hora: string; entradas: number; ingresos: number; }
export interface ReporteVentas { totalEntradas: number; totalIngresos: number; porPelicula: VentaPelicula[]; porFuncion: VentaFuncion[]; }

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private apiUrl = 'http://localhost:8080/reporte';
  constructor(private http: HttpClient) {}

  ventas(desde?: string, hasta?: string): Observable<ReporteVentas> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<ReporteVentas>(`${this.apiUrl}/ventas`, { params });
  }
}