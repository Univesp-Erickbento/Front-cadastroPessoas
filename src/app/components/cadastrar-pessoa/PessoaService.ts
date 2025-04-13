import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';  // Para redirecionamento caso o token não esteja presente

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private baseUrl = 'http://192.168.15.200:9090/api/pessoas';

  constructor(private http: HttpClient, private router: Router) {}

  // Função para obter os cabeçalhos com o token de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Caso o token não exista, redireciona para a página de login
      this.router.navigate(['/login']);
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Função para cadastrar uma pessoa
  cadastrarPessoa(pessoa: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/adicionar`, pessoa, {
      headers: this.getAuthHeaders()
    });
  }

  // Função para listar todas as pessoas
  listarTodas(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // Função para buscar pessoa por ID
  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Função para buscar pessoa por CPF
  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cpf/${cpf}`, { headers: this.getAuthHeaders() });
  }

  // Função para atualizar uma pessoa
  atualizarPessoa(id: number, pessoa: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, pessoa, { headers: this.getAuthHeaders() });
  }

  // Função para deletar uma pessoa
  deletarPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Função para salvar o token no localStorage
  salvarToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // Função para obter o token do localStorage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Função para fazer logout (remover o token do localStorage)
  logout() {
    localStorage.removeItem('authToken');
  }
}
