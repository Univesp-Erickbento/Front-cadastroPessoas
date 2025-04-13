import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importando o AuthService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  // Interceptando a requisição HTTP para adicionar o token de autenticação no cabeçalho
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.authService.getToken(); // Obtendo o token do AuthService

    if (token) {
      // Se o token existir, clona a requisição e adiciona o cabeçalho Authorization
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest); // Envia a requisição clonada
    }

    // Se não houver token, envia a requisição sem modificações
    return next.handle(request);
  }
}
