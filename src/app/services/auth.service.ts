import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = `${environment.AUTH_API}/login`;
  private registerUrl = `${environment.AUTH_API}/register`;
  private tokenKey = 'authToken';
  private redirectUrlKey = 'redirectUrl';

  constructor(private http: HttpClient) {}

  // 🔹 Login do usuário
  login(credentials: { nomeUsuario: string, senha: string }): Observable<any> {
    // Limpa token antigo
    localStorage.removeItem(this.tokenKey);

    const loginRequest = {
      nomeUsuario: credentials.nomeUsuario,
      senha: credentials.senha
    };

    return this.http.post<any>(this.loginUrl, loginRequest, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // 🔹 Registro de novo usuário
  register(credentials: { nomeUsuario: string, senha: string }): Observable<any> {
    const registerRequest = {
      nomeUsuario: credentials.nomeUsuario,
      senha: credentials.senha
    };

    return this.http.post<any>(this.registerUrl, registerRequest, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // 🔹 Salva token JWT no localStorage
  salvarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // 🔹 Retorna o token JWT armazenado
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 🔹 Limpa token JWT
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // 🔹 Armazena URL para redirecionamento pós-login
  setRedirectUrl(url: string): void {
    localStorage.setItem(this.redirectUrlKey, url);
  }

  // 🔹 Recupera URL para redirecionamento pós-login
  getRedirectUrl(): string | null {
    return localStorage.getItem(this.redirectUrlKey);
  }
}
