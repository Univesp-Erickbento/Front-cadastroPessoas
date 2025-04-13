import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  entrarForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializando o formulário com os campos nomeUsuario e senha
    this.entrarForm = this.fb.group({
      nomeUsuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  // Método chamado ao submeter o formulário de login
  entrar() {
    if (this.entrarForm.valid) {
      const loginData = this.entrarForm.value;

      console.log('🔐 Enviando login:', loginData);
      console.log('🌐 URL do login:', this.authService['loginUrl']);

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('✅ Login bem-sucedido:', response);

          if (response && response.accessToken) {
            // Salva o token JWT
            this.authService.salvarToken(response.accessToken);

            // Redireciona para o dashboard ou rota salva anteriormente
            const redirectTo = this.authService.getRedirectUrl();
            this.router.navigate([redirectTo || '/dashboard']);
          } else {
            console.warn('⚠️ Token não encontrado na resposta.');
            alert('Login falhou: token não recebido.');
          }
        },
        error: (err) => {
          console.error('❌ Erro no login:', err);
          alert('Falha ao entrar! Verifique suas credenciais.');
        }
      });
    } else {
      console.warn('⚠️ Formulário de login inválido.');
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}
