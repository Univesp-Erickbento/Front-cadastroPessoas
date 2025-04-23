import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cadastrar-funcionario',
  templateUrl: './cadastrar-funcionario.component.html',
  styleUrls: ['./cadastrar-funcionario.component.css']
})

export class CadastrarFuncionarioComponent implements OnInit {
  funcionarioForm!: FormGroup;
  nome: string | null = null;
  cpf: string | null = null;
  pessoaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nome = params['nome'] || null;
      this.cpf = params['cpf'] || null;
      this.pessoaId = params['pessoaId'] || null;
    });

    this.funcionarioForm = this.fb.group({
      id: [{ value: this.gerarId(), disabled: true }],
      tipo: ['', Validators.required],
      funcionarioRg: ['', Validators.required],
      funcionarioStatus: ['', Validators.required],
      dataDeAdmissao: ['', Validators.required],
      nome: [{ value: this.nome, disabled: true }],
      cpf: [this.cpf || '', Validators.required],
      pessoaId: [this.pessoaId]
    });

    if (this.nome) {
      this.funcionarioForm.patchValue({ nome: this.nome });
    }
  }

  gerarId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  formatarCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    let cpf = input.value.replace(/\D/g, '');

    if (cpf.length > 11) cpf = cpf.substring(0, 11);

    if (cpf.length <= 3) {
      cpf = cpf;
    } else if (cpf.length <= 6) {
      cpf = cpf.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (cpf.length <= 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    this.funcionarioForm.get('cpf')?.setValue(cpf);
  }

  onSubmit(): void {
    if (this.funcionarioForm.valid) {
      const cpfLimpo = this.funcionarioForm.getRawValue().cpf.replace(/\D/g, '');

      const funcionarioDTO = {
        cpf: cpfLimpo,
        funcionarioTipo: this.funcionarioForm.get('tipo')?.value,
        funcionarioReg: this.funcionarioForm.get('funcionarioRg')?.value,
        funcionarioStatus: this.funcionarioForm.get('funcionarioStatus')?.value,
        dataDeAdmissao: this.funcionarioForm.get('dataDeAdmissao')?.value
      };

      const token = this.authService.getToken();

      if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.post<HttpResponse<any>>(
        'http://localhost:8080/api/funcionarios/adicionar',
        funcionarioDTO,
        { headers, observe: 'response' }
      ).subscribe({
        next: (response) => {
          if (response.status === 201 || response.status === 200) {
            alert('Funcionário cadastrado com sucesso!');
            this.router.navigate(['/cadastrar-endereco'], {
              queryParams: {
                cpf: cpfLimpo,
                pessoaId: this.funcionarioForm.get('pessoaId')?.value
              }
            });
          } else {
            alert('Funcionário pode ter sido cadastrado, mas com status inesperado.');
          }
        },
        error: (err) => {
          console.error('Erro ao cadastrar funcionário:', err);
          const message = err.error?.message || 'Erro ao cadastrar funcionário.';
          alert(message);
        }
      });
    } else {
      alert('Preencha todos os campos corretamente antes de continuar.');
    }
  }

  voltar(): void {
    this.router.navigate(['/cadastrar-pessoa']);
  }

  pesquisarPessoa(): void {
    const cpfPesquisado = this.funcionarioForm.getRawValue().cpf.replace(/\D/g, '');

    if (cpfPesquisado) {
      const token = this.authService.getToken();

      if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.get(`http://localhost:9090/api/pessoas/cpf/${cpfPesquisado}`, { headers })
        .subscribe(
          (response: any) => {
            if (response && response.nome && response.id) {
              this.nome = response.nome;
              this.cpf = response.cpf;
              this.pessoaId = response.id;

              this.funcionarioForm.patchValue({
                nome: this.nome,
                cpf: this.cpf,
                pessoaId: this.pessoaId
              });

              alert('Pessoa encontrada com sucesso!');
            } else {
              alert('Pessoa não encontrada!');
            }
          },
          error => {
            alert('Erro ao buscar pessoa no banco de dados!');
            console.error(error);
          }
        );
    } else {
      alert('Por favor, insira um CPF para pesquisar.');
    }
  }
}
