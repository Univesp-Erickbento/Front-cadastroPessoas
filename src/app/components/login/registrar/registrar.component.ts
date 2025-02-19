import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  registrarForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.registrarForm = this.fb.group({
      nomeUsuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  registrar() {
    if (this.registrarForm.valid) {
      const credentials = this.registrarForm.value;
      console.log('Dados para cadastro:', credentials);

      this.authService.register(credentials).subscribe({
        next: (response) => {
          console.log('Cadastro realizado:', response);
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']); // Redireciona após cadastro bem-sucedido
        },
        error: (err) => {
          if (err.status === 200) {
            // Tratar 200 OK como sucesso
            console.log('Cadastro realizado:', err.error);
            alert('Cadastro realizado com sucesso!');
            this.router.navigate(['/login']); // Redireciona após cadastro bem-sucedido
          } else {
            console.error('Erro ao cadastrar:', err);
            alert('Falha ao cadastrar! Verifique suas informações.');
          }
        }
      });
    } else {
      console.log('Formulário inválido');
    }
  }
}
