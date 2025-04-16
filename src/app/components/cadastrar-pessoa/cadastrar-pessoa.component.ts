import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PessoaService } from './PessoaService';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      this.destino = params['destino'];
    });

    this.pessoaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      sobrenome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
      cpf: ['', [Validators.required]],
      rg: ['', [Validators.required]],
      genero: ['', Validators.required],
      nascimento: ['', Validators.required]
    });
  }

  formatarCpf(event: any) {
    let cpf = event.target.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.substring(0, 11);

    if (cpf.length <= 3) {
      // nada
    } else if (cpf.length <= 6) {
      cpf = cpf.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (cpf.length <= 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    this.pessoaForm.get('cpf')?.setValue(cpf, { emitEvent: false });
  }

  formatarRg(event: any) {
    let rg = event.target.value.replace(/\D/g, '');
    if (rg.length > 9) rg = rg.substring(0, 9);
  
    if (rg.length <= 2) {
      // nada
    } else if (rg.length <= 5) {
      rg = rg.replace(/(\d{2})(\d+)/, '$1.$2');
    } else if (rg.length <= 8) {
      rg = rg.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      rg = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3/$4');
    }
  
    this.pessoaForm.get('rg')?.setValue(rg, { emitEvent: false });
  }
  

  proximo() {
    if (this.pessoaForm.valid) {
      const pessoaDados = { ...this.pessoaForm.value };

      // Limpar CPF e RG antes de enviar
      pessoaDados.cpf = pessoaDados.cpf.replace(/\D/g, '');
      pessoaDados.rg = pessoaDados.rg.replace(/\D/g, '');

      const token = this.authService.getToken();
      if (!token) {
        alert('Você precisa estar logado para realizar o cadastro!');
        this.router.navigate(['/login']);
        return;
      }

      this.pessoaService.cadastrarPessoa(pessoaDados).subscribe(
        response => {
          alert('Cadastro realizado com sucesso!');

          const queryParams = {
            nome: response.nome,
            cpf: response.cpf,
            pessoaId: response.id
          };

          if (this.destino === 'funcionario') {
            this.router.navigate(['/funcionarios'], { queryParams });
          } else if (this.destino === 'cliente') {
            this.router.navigate(['/clientes'], { queryParams });
          } else {
            this.router.navigate(['/']);
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
