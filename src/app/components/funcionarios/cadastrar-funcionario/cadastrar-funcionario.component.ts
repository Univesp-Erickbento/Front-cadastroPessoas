import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastrar-funcionario',
  templateUrl: './cadastrar-funcionario.component.html',
  styleUrls: ['./cadastrar-funcionario.component.css']
})
export class CadastrarFuncionarioComponent implements OnInit {

  funcionarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;

    this.funcionarioForm = this.fb.group({
      id: [{ value: this.gerarId(), disabled: true }],
      nome: [{ value: queryParams['nome'] || '', disabled: true }],
      cpf: [queryParams['cpf'] || '', [Validators.required]],
      pessoaId: [queryParams['pessoaId'] || ''],
      tipo: ['', Validators.required],
      funcionarioRg: ['', Validators.required],
      funcionarioStatus: ['', Validators.required],
      dataDeAdmissao: ['', Validators.required]
    });
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

    this.funcionarioForm.get('cpf')?.setValue(cpf, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.funcionarioForm.invalid) {
      alert('Preencha todos os campos corretamente antes de continuar.');
      return;
    }

    const formValue = this.funcionarioForm.getRawValue();
    const funcionarioDTO = {
      cpf: formValue.cpf.replace(/\D/g, ''),
      funcionarioTipo: formValue.tipo,
      funcionarioReg: formValue.funcionarioRg,
      funcionarioStatus: formValue.funcionarioStatus,
      dataDeAdmissao: formValue.dataDeAdmissao
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
      `${environment.cadastroFuncionarioApi}/funcionarios/adicionar`,
      funcionarioDTO,
      { headers, observe: 'response' }
    ).subscribe({
      next: (response) => {
        if (response.status === 200 || response.status === 201) {
          alert('Funcionário cadastrado com sucesso!');
          this.router.navigate(['/cadastrar-endereco'], {
            queryParams: {
              cpf: funcionarioDTO.cpf,
              pessoaId: formValue.pessoaId
            }
          });
        } else {
          alert('Funcionário cadastrado, mas com status inesperado.');
        }
      },
      error: (err) => {
        console.error('Erro ao cadastrar funcionário:', err);
        const message = err.error?.mensagem || 'Erro ao cadastrar funcionário.';
        alert(message);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/cadastrar-pessoa']);
  }

  pesquisarPessoa(): void {
    const cpf = this.funcionarioForm.getRawValue().cpf.replace(/\D/g, '');
    if (!cpf) {
      alert('Por favor, insira um CPF para pesquisar.');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get(`${environment.cadastroPessoasApi}/pessoas/cpf/${cpf}`, { headers })
      .subscribe({
        next: (response: any) => {
          if (response && response.nome && response.id) {
            this.funcionarioForm.patchValue({
              nome: response.nome,
              cpf: response.cpf,
              pessoaId: response.id
            });
            alert('Pessoa encontrada com sucesso!');
          } else {
            alert('Pessoa não encontrada!');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao buscar pessoa no banco de dados!');
        }
      });
  }
}
