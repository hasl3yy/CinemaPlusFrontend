import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sala {
    id_sala: number;
    nombre: string;
    fila: number;
    asiento_por_fila: number;
    estado: string;
}

@Injectable({
    providedIn: 'root'
})

export class SalasService {
    private apiUrl = 'http://localhost:8080/sala';


    constructor(private http: HttpClient) { }

    listar(): Observable<Sala[]> {
        return this.http.get<Sala[]>(`${this.apiUrl}/buscar`);
    }

    guardar(sala: Partial<Sala>): Observable<Sala> {
        return this.http.post<Sala>(`${this.apiUrl}/guardar`, sala);
    }


    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
    }
}