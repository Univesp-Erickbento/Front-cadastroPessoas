import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://192.168.15.200:9090/auth/login';
  private registerUrl = 'http://192.168.15.200:9090/auth/register';

  constructor(private http: HttpClient) {}

  // Login com nomeUsuario e senha
  login(credentials: { nomeUsuario: string, senha: string }): Observable<any> {
    // Remover o token expirado ou qualquer token armazenado no localStorage antes do login
    localStorage.removeItem('authToken');

    const loginRequest = {
      nomeUsuario: credentials.nomeUsuario,
      senha: credentials.senha
    };

    return this.http.post<any>(this.loginUrl, loginRequest, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Registro de novo usuário
  register(credentials: { nomeUsuario: string, senha: string }): Observable<any> {
    const registerRequest = {
      nomeUsuario: credentials.nomeUsuario,
      senha: credentials.senha
    };

    return this.http.post<any>(this.registerUrl, registerRequest, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Salvar token JWT
  salvarToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Recuperar o token JWT
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Realizar logout e remover o token
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Redirecionamento após login
  setRedirectUrl(url: string): void {
    localStorage.setItem('redirectUrl', url);
  }

  getRedirectUrl(): string | null {
    return localStorage.getItem('redirectUrl');
  }
}
