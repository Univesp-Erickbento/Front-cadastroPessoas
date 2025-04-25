import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; // Certifique-se de que o caminho está correto
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  entrarForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializando o formulário com os campos nomeUsuario e senha
    this.entrarForm = this.fb.group({
      nomeUsuario: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]]
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
            this.router.navigate([redirectTo || '/menu']);
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

  // Método para navegação (pode ser usado para navegação para uma página de cadastro)
  navigate() {
    this.router.navigate(['/registrar']); // Exemplo de navegação para página de cadastro
  }

  // Função para recuperação de senha
  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
