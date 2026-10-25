import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sala } from './salas.service';


export interface Fila {
    id_fila: number;
    sala: Sala | null;
    nombre: string;
    cantidad_de_asientos : number;
}

@Injectable({
    providedIn: 'root'
})


export class FilaService {
    private apiUrl = 'http://localhost:8080/fila';


    constructor(private http: HttpClient) { }

        listaPorSala(idSala: number): Observable<Fila[]> {
        return this.http.get<Fila[]>(`${this.apiUrl}/buscar/${idSala}`);
    }

    
    guardar(fila: Partial<Fila>): Observable<Fila> {
        return this.http.post<Fila>(`${this.apiUrl}/guardar`, fila);
    }


    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
    }
}
