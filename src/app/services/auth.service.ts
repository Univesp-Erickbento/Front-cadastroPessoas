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

  constructor(private http: HttpClient) {}

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
