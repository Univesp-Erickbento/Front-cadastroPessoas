import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-finalizarcadastro',
  templateUrl: './finalizarcadastro.component.html',
  styleUrls: ['./finalizarcadastro.component.css']
})
export class FinalizarcadastroComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  
  cadastroForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    sobrenome: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    rg: new FormControl('', Validators.required),
    genero: new FormControl('', Validators.required),
    email: this.email,
    telefone: new FormControl('', Validators.required),
    dataNascimento: new FormControl('', Validators.required)
  });

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Você deve inserir um valor';
    }

    return this.email.hasError('email') ? 'Email não é válido' : '';
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      // Lógica para processar o formulário
      console.log(this.cadastroForm.value);
    }
  }
}
