import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PessoaService } from './PessoaService';  // Certifique-se de importar o serviço corretamente
import { AuthService } from '../../services/auth.service';  // Importando o AuthService para verificar o token

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
    private route: ActivatedRoute,
    private authService: AuthService // Adicionando o AuthService para verificar o token
  ) {
    // Captura o parâmetro "destino" da URL
    this.route.queryParams.subscribe(params => {
      this.destino = params['destino'];
    });

    // Criação do formulário com validações
    this.pessoaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      sobrenome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}-\d{1}$/)]],
      genero: ['', Validators.required],
      nascimento: ['', Validators.required]
    });
  }

  // Método 'Proximo' que será chamado ao clicar no botão
  proximo() {
    if (this.pessoaForm.valid) {
      const pessoaDados = this.pessoaForm.value;

      // Verificando se o token está presente
      const token = this.authService.getToken();
      if (!token) {
        alert('Você precisa estar logado para realizar o cadastro!');
        this.router.navigate(['/login']); // Redireciona para o login caso o token não exista
        return;
      }

      // Passando o token como cabeçalho na requisição
      this.pessoaService.cadastrarPessoa(pessoaDados).subscribe(

        response => {
          console.log('Cadastro realizado:', response);
          alert('Cadastro realizado com sucesso!');

          // Redireciona para a página conforme o parâmetro "destino"
          if (this.destino === 'funcionario') {
            this.router.navigate(['/funcionarios']);  // Corrigido: `/funcionarios` (plural)
          } else if (this.destino === 'cliente') {
            this.router.navigate(['/clientes']);  // Corrigido: `/clientes` (plural)
          } else {
            this.router.navigate(['/']); // Fallback para a página inicial
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
