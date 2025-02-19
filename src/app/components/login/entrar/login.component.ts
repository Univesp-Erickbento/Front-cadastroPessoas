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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.entrarForm = this.fb.group({
      nomeUsuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  entrar() {
    if (this.entrarForm.valid) {
      console.log('Dados para login:', this.entrarForm.value);
      console.log('Enviando requisição para URL:', this.authService['loginUrl']);
  
      this.authService.login(this.entrarForm.value).subscribe({
        next: (response) => {
          console.log('Login realizado:', response);
          if (response.accessToken) {
            this.authService.salvarToken(response.accessToken);
            this.router.navigate(['/dashboard']); // Redireciona após login
          } else {
            console.error('Erro ao receber o token');
            alert('Falha ao entrar! Verifique suas credenciais.');
          }
        },
        error: (err) => {
          console.error('Erro ao entrar:', err);
          alert('Falha ao entrar! Verifique suas credenciais.');
        }
      });
    } else {
      console.log('Formulário inválido');
    }
  }
}
