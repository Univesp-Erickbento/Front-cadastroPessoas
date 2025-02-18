import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  entrarForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.entrarForm = this.fb.group({
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  fazerLogin() {
    if (this.entrarForm.valid) {
      const username = this.entrarForm.get('username').value;
      const senha = this.entrarForm.get('senha').value;
      console.log(`Username: ${username}, Senha: ${senha}`);
      // Implemente a lógica de autenticação aqui
    } else {
      console.log('Formulário inválido');
    }
  }
}
