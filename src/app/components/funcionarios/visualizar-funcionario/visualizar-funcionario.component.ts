import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment'; // ✅ Importação

@Component({
  selector: 'app-visualizar-funcionario',
  templateUrl: './visualizar-funcionario.component.html',
  styleUrls: ['./visualizar-funcionario.component.css']
})
export class VisualizarFuncionarioComponent implements OnInit {

  funcionarioForm!: FormGroup;
  modoVisualizacaoPorId = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.funcionarioForm = this.fb.group({
      nome: [''],
      cpf: [''],
      pessoaId: [''],
      funcionarioReg: [''],
      funcionarioStatus: [''],
      funcionarioTipo: [''],
      dataDeAdmissao: ['']
    });

    this.funcionarioForm.get('nome')?.disable();
    this.funcionarioForm.get('pessoaId')?.disable();
    this.funcionarioForm.get('funcionarioReg')?.disable();
    this.funcionarioForm.get('funcionarioStatus')?.disable();
    this.funcionarioForm.get('funcionarioTipo')?.disable();
    this.funcionarioForm.get('dataDeAdmissao')?.disable();

    const funcionarioId = this.route.snapshot.paramMap.get('id');
    if (funcionarioId) {
      this.modoVisualizacaoPorId = true;
      this.buscarFuncionarioPorId(funcionarioId);
    }
  }

  buscarFuncionarioPorId(id: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`${environment.cadastroFuncionarioApi}/funcionarios/${id}`, { headers })
      .subscribe({
        next: (funcionario) => {
          this.funcionarioForm.patchValue({
            nome: funcionario.nome,
            cpf: funcionario.cpf,
            pessoaId: funcionario.pessoaId,
            funcionarioReg: funcionario.funcionarioReg,
            funcionarioStatus: funcionario.funcionarioStatus,
            funcionarioTipo: funcionario.funcionarioTipo,
            dataDeAdmissao: funcionario.dataDeAdmissao
          });
        },
        error: (err) => {
          console.error('Erro ao buscar funcionário por ID:', err);
          alert('Erro ao carregar dados do funcionário.');
        }
      });
  }

  pesquisarPessoa(): void {
    const cpf = this.funcionarioForm.get('cpf')?.value?.replace(/\D/g, '');

    if (!cpf) {
      alert('Informe um CPF válido.');
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`${environment.cadastroPessoasApi}/pessoas/cpf/${cpf}`, { headers })
      .subscribe({
        next: (pessoa) => {
          const pessoaId = pessoa.id;
          const nome = pessoa.nome;

          this.funcionarioForm.patchValue({
            nome: nome,
            cpf: pessoa.cpf,
            pessoaId: pessoaId
          });

          this.http.get<any>(`${environment.cadastroFuncionarioApi}/funcionarios/pessoa/${pessoaId}`, { headers })
            .subscribe({
              next: (funcionario) => {
                this.funcionarioForm.patchValue({
                  funcionarioReg: funcionario.funcionarioReg,
                  funcionarioStatus: funcionario.funcionarioStatus,
                  funcionarioTipo: funcionario.funcionarioTipo,
                  dataDeAdmissao: funcionario.dataDeAdmissao
                });
              },
              error: (err) => {
                console.warn('Funcionário não encontrado para este pessoaId.');
                this.funcionarioForm.patchValue({
                  funcionarioReg: '',
                  funcionarioStatus: '',
                  funcionarioTipo: '',
                  dataDeAdmissao: ''
                });
                alert('Funcionário não encontrado.');
              }
            });
        },
        error: (err) => {
          console.error('Erro ao buscar pessoa pelo CPF:', err);
          alert('Pessoa não encontrada para este CPF.');
        }
      });
  }

  formatarCpf(event: any): void {
    let cpf = event.target.value;
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    this.funcionarioForm.get('cpf')?.setValue(cpf);
  }

  voltar(): void {
    window.history.back();
  }
}
