import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = `${environment.AUTH_API}/auth/login`;
  private registerUrl = `${environment.AUTH_API}/auth/register`;

  constructor(private http: HttpClient) {}

  // Login com nomeUsuario e senha
  login(credentials: { nomeUsuario: string, senha: string }): Observable<any> {
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

  salvarToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  setRedirectUrl(url: string): void {
    localStorage.setItem('redirectUrl', url);
  }

  getRedirectUrl(): string | null {
    return localStorage.getItem('redirectUrl');
  }
}
