import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  registrarForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registrarForm = this.fb.group({
      nomeUsuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  registrar() {
    if (this.registrarForm.valid) {
      const credentials = this.registrarForm.value;
      console.log('📤 Dados para cadastro:', credentials);

      this.authService.register(credentials).subscribe({
        next: (response) => {
          console.log('✅ Cadastro realizado com sucesso:', response);
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']); // Redireciona para login após cadastro
        },
        error: (err) => {
          // Alguns backends respondem 200 dentro de erro por configuração errada
          if (err.status === 200) {
            console.warn('⚠️ Erro tratado como sucesso:', err.error);
            alert('Cadastro realizado com sucesso!');
            this.router.navigate(['/login']);
          } else {
            console.error('❌ Erro ao cadastrar:', err);
            const msg = err.error?.message || 'Falha ao cadastrar! Verifique suas informações.';
            alert(msg);
          }
        }
      });
    } else {
      console.warn('⚠️ Formulário inválido');
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
