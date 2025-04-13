import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionarioComponent implements OnInit {
  funcionarioForm!: FormGroup;
  nome: string | null = null;
  cpf: string | null = null;
  pessoaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
      nome: [this.nome],
      cpf: [this.cpf]
    });

    if (this.nome && this.cpf) {
      this.funcionarioForm.patchValue({
        nome: this.nome,
        cpf: this.cpf
      });
    }
  }

  gerarId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  onSubmit(): void {
    if (this.funcionarioForm.valid && this.nome && this.cpf && this.pessoaId) {
      const funcionarioDTO = {
        pessoaId: this.pessoaId,
        cpf: this.cpf,
        funcionarioTipo: this.funcionarioForm.get('tipo')?.value,
        funcionarioReg: this.funcionarioForm.get('funcionarioRg')?.value,
        funcionarioStatus: this.funcionarioForm.get('funcionarioStatus')?.value,
        dataDeAdmissao: this.funcionarioForm.get('dataDeAdmissao')?.value,
        dataDeDemissao: null  // Adicione se quiser permitir demissão mais tarde
      };

      const token = localStorage.getItem('token');  // Você pode mudar onde o token está armazenado

      if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.post('http://localhost:8080/api/funcionarios/adicionar', funcionarioDTO, { headers })
        .subscribe({
          next: (res: any) => {
            console.log('Funcionário cadastrado com sucesso:', res);
            alert('Funcionário cadastrado com sucesso!');
            this.router.navigate(['/lista-funcionarios']); // Redirecionar ou ajustar rota
          },
          error: (err) => {
            console.error('Erro ao cadastrar funcionário:', err);
            const message = err.error || 'Erro ao cadastrar funcionário.';
            alert(message);
          }
        });

    } else {
      alert('Preencha todos os campos e selecione uma pessoa antes de continuar.');
    }
  }

  voltar(): void {
    this.router.navigate(['/cadastrar-pessoa']);
  }

  pesquisarPessoa(): void {
    const cpfPesquisado = this.funcionarioForm.get('cpf')?.value;

    if (cpfPesquisado) {
      this.http.get(`http://localhost:9090/api/pessoas?cpf=${cpfPesquisado}`).subscribe(
        (response: any) => {
          if (response && response.nome && response.cpf) {
            this.nome = response.nome;
            this.cpf = response.cpf;
            this.pessoaId = response.id;
            this.funcionarioForm.patchValue({
              nome: this.nome,
              cpf: this.cpf
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
