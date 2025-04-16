import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClienteComponent implements OnInit {
  clienteForm!: FormGroup;
  nome: string | null = null;
  cpf: string | null = null;
  pessoaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nome = params['nome'] || null;
      this.cpf = params['cpf'] || null;
      this.pessoaId = params['pessoaId'] || null;
    });

    this.clienteForm = this.fb.group({
      id: [{ value: this.gerarId(), disabled: true }],
      rg: ['', Validators.required],
      status: ['', Validators.required],
      nome: [this.nome],
      cpf: [this.cpf || '', Validators.required]
    });

    if (this.nome && this.cpf) {
      this.clienteForm.patchValue({
        nome: this.nome,
        cpf: this.cpf
      });
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

    this.clienteForm.get('cpf')?.setValue(cpf);
  }

  onSubmit() {
    if (this.clienteForm.valid && this.pessoaId) {
      const cpfLimpo = this.clienteForm.get('cpf')?.value.replace(/\D/g, '');

      const clienteDTO = {
        pessoaId: this.pessoaId,
        cpf: cpfLimpo,
        clienteRg: this.clienteForm.get('rg')?.value,
        clienteStatus: this.clienteForm.get('status')?.value,
        dataDeCadastro: new Date()
      };

      const token = localStorage.getItem('token');

      if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.post('http://localhost:8080/api/clientes/adicionar', clienteDTO, { headers })
        .subscribe({
          next: (res: any) => {
            alert('Cliente cadastrado com sucesso!');
            this.router.navigate(['/lista-clientes']);
          },
          error: (err) => {
            console.error('Erro ao cadastrar cliente:', err);
            const message = err.error || 'Erro ao cadastrar cliente.';
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
    const cpfPesquisado = this.clienteForm.get('cpf')?.value.replace(/\D/g, '');

    if (cpfPesquisado) {
      this.http.get(`http://localhost:9090/api/pessoas?cpf=${cpfPesquisado}`).subscribe(
        (response: any) => {
          if (response && response.nome && response.cpf) {
            this.nome = response.nome;
            this.cpf = response.cpf;
            this.pessoaId = response.id;

            this.clienteForm.patchValue({
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
