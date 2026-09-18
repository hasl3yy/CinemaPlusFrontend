import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Anuncio {
  id_anuncio: number;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  fechaPublicacion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {
  private apiUrl = 'http://localhost:8080/anuncio';

  constructor(private http: HttpClient) {}

  listar(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.apiUrl}/buscar`);
  }

  guardar(anuncio: Partial<Anuncio>): Observable<Anuncio> {
    return this.http.post<Anuncio>(`${this.apiUrl}/guardar`, anuncio);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}