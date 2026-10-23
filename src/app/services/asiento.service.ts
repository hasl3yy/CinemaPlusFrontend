import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sala } from './salas.service';

export interface Asiento {
    id_asiento: number;
    sala: Sala | null;
    fila: String;
    numero: number;
}


@Injectable({
    providedIn: 'root'
})


export class AsientosService {
    private apiUrl = 'http://localhost:8080/asiento';

    constructor(private http: HttpClient) { }

    listarPorSala(id_sala: number): Observable<Asiento[]> {
        return this.http.get<Asiento[]>(`${this.apiUrl}/buscar/sala/${id_sala}`);
    }
}