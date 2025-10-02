import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GuessRequest {
  names: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GuessService {
  private apiUrl = 'http://localhost:9000/api/plouf'; // ✅ ton backend

  constructor(private http: HttpClient) {}

  /**
   * Tirer un nom au hasard
   * @param names Liste des noms
   * @returns Nom choisi
   */
  draw(names: string[]): Observable<string> {
    return this.http.post(this.apiUrl + '/draw', { names }, { responseType: 'text' });
  }
  /**
   * Obtenir la liste des noms déjà choisis
   */
  getChosen(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + '/chosen');
  }

  /**
   * Obtenir la liste des noms restants
   */
  getRemaining(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + '/remaining');
  }

  /**
   * Réinitialiser le jeu
   */
  reset(): Observable<string> {
    return this.http.delete(this.apiUrl + '/reset', { responseType: 'text' });
  }

  /**
   * Supprimer un nom de la liste des participants
   * @param name Nom à remettre dans les participants
   */
  remove(name: string): Observable<{ remaining: string[]; chosen: string[] }> {
    return this.http.post<{ remaining: string[]; chosen: string[] }>(
      this.apiUrl + '/remove',
      { name }
    );
  }
}
