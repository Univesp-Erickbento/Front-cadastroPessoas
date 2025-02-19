import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://192.168.15.200:9090/auth/login'; // URL do seu backend
  private registerUrl = 'http://192.168.15.200:9090/auth/register'; // URL de registro

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    const loginRequest = {
      nomeUsuario: credentials.nomeUsuario, // Nome ajustado para corresponder ao backend
      senha: credentials.senha
    };
    return this.http.post<any>(this.loginUrl, loginRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  register(credentials: any): Observable<any> {
    const registerRequest = {
      nomeUsuario: credentials.nomeUsuario, // Nome ajustado para corresponder ao backend
      senha: credentials.senha
    };
    return this.http.post<any>(this.registerUrl, registerRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
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
