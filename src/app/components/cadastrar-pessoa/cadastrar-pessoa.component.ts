import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Importar o Router
import { PessoaService } from './PessoaService';

@Component({
  selector: 'app-cadastrar-pessoa',
  templateUrl: './cadastrar-pessoa.component.html',
  styleUrls: ['./cadastrar-pessoa.component.css']
})
export class CadastrarPessoaComponent {
  pessoaForm: FormGroup;

  constructor(private fb: FormBuilder, private pessoaService: PessoaService, private router: Router) {
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
      // Clonar os dados do formulário e remover os campos de checkbox
      const pessoaDados = { ...this.pessoaForm.value };
      delete pessoaDados.funcionario;
      delete pessoaDados.cliente;

      this.pessoaService.cadastrarPessoa(pessoaDados).subscribe(
        response => {
          console.log('Cadastro realizado:', response);
          alert('Cadastro realizado com sucesso!');

          // Redirecionar conforme o checkbox selecionado
          if (this.pessoaForm.get('funcionario')?.value) {
            this.router.navigate(['/funcionario']);
          } else if (this.pessoaForm.get('cliente')?.value) {
            this.router.navigate(['/cliente']);
          }
        },
        error => {
          console.error('Erro ao realizar cadastro:', error);
          alert('Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente.');
        }
      );
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}
