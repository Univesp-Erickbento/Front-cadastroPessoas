import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  cadastrarPessoa(pessoa: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pessoa/adicionar`, pessoa, {
      headers: this.getAuthHeaders()
    });
  }

  listarTodas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pessoa`, { headers: this.getAuthHeaders() });
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pessoa/${id}`, { headers: this.getAuthHeaders() });
  }

  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pessoa/cpf/${cpf}`, { headers: this.getAuthHeaders() });
  }

  atualizarPessoa(id: number, pessoa: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/pessoa/${id}`, pessoa, {
      headers: this.getAuthHeaders()
    });
  }

  deletarPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pessoa/${id}`, {
      headers: this.getAuthHeaders()
    });
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
