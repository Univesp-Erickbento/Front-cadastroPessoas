import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-pessoa',
  templateUrl: './cadastrar-pessoa.component.html',
  styleUrls: ['./cadastrar-pessoa.component.css']
})
export class CadastrarPessoaComponent {
  pessoaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pessoaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      sobrenome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}-\d{1}$/)]],
      genero: ['', Validators.required],
      nascimento: ['', Validators.required],

      // Checkboxes
      funcionario: [false],
      cliente: [false]
    }, { validators: this.cargoValidator });
  }

  // Validação personalizada para exigir pelo menos um cargo selecionado
  cargoValidator(form: FormGroup) {
    const funcionario = form.get('funcionario')?.value;
    const cliente = form.get('cliente')?.value;

    return funcionario || cliente ? null : { noCargo: true };
  }

  cadastrar() {
    if (this.pessoaForm.valid) {
      console.log('Cadastro realizado:', this.pessoaForm.value);
      alert('Cadastro realizado com sucesso!');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}
