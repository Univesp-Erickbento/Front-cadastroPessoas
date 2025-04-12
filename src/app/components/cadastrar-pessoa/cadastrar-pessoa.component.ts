import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PessoaService } from './PessoaService';

@Component({
  selector: 'app-cadastrar-pessoa',
  templateUrl: './cadastrar-pessoa.component.html',
  styleUrls: ['./cadastrar-pessoa.component.css']
})
export class CadastrarPessoaComponent {
  pessoaForm: FormGroup;
  destino: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Captura o parâmetro "destino" da URL
    this.route.queryParams.subscribe(params => {
      this.destino = params['destino'];
    });

    this.pessoaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      sobrenome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}-\d{1}$/)]],
      genero: ['', Validators.required],
      nascimento: ['', Validators.required]
    });
  }

  proximo() {
    if (this.pessoaForm.valid) {
      const pessoaDados = this.pessoaForm.value;

      this.pessoaService.cadastrarPessoa(pessoaDados).subscribe(
        response => {
          console.log('Cadastro realizado:', response);
          alert('Cadastro realizado com sucesso!');

          // Redireciona para a página conforme o parâmetro "destino"
          if (this.destino === 'funcionario') {
            this.router.navigate(['/funcionario']);
          } else if (this.destino === 'cliente') {
            this.router.navigate(['/cliente']);
          } else {
            this.router.navigate(['/']); // fallback padrão
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
