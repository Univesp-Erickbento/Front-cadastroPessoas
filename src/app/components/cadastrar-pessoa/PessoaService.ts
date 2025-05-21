import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private baseUrl = environment.cadastroPessoasApi; // Substituindo pelo URL de produção

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
    return this.http.post<any>(`${this.baseUrl}/pessoas/adicionar`, pessoa, {
      headers: this.getAuthHeaders()
    });
  }

  listarTodas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pessoas`, {
      headers: this.getAuthHeaders()
    });
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pessoas/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pessoas/cpf/${cpf}`, {
      headers: this.getAuthHeaders()
    });
  }

  atualizarPessoa(id: number, pessoa: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/pessoas/${id}`, pessoa, {
      headers: this.getAuthHeaders()
    });
  }

  deletarPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pessoas/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  salvarToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
