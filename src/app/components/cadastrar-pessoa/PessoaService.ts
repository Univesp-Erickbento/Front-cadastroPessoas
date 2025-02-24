import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private baseUrl = 'http://192.168.15.200:9090/api/pessoas';
   

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  cadastrarPessoa(pessoa: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/adicionar`, pessoa, {
      headers: this.getAuthHeaders()
    });
  }

  listarTodas(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cpf/${cpf}`, { headers: this.getAuthHeaders() });
  }

  atualizarPessoa(id: number, pessoa: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, pessoa, { headers: this.getAuthHeaders() });
  }

  deletarPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

 
  salvarToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}
