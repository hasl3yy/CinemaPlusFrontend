import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/buscar`);
  }

  guardar(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/guardar`, usuario);
  }

  eliminar(id:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`); 
  }

  activarUsuario(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activar/${id}`, {});
  }

  desactivarUsuario(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/desactivar/${id}`, {});
  }

  actualizarUsuario(id:number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/actualizar/${id}`, usuario);
  }
}