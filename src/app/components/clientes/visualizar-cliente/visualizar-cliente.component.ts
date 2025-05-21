import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';  // Importando o ambiente

@Component({
  selector: 'app-visualizar-cliente',
  templateUrl: './visualizar-cliente.component.html',
  styleUrls: ['./visualizar-cliente.component.css']
})
export class VisualizarClienteComponent implements OnInit {

  clienteForm!: FormGroup;
  modoVisualizacaoPorId = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nome: [''],
      cpf: [''],
      pessoaId: [''],
      clienteReg: [''],
      clienteStatus: ['']
    });

    // Só busca por ID se estiver vindo pela rota /visualizar-cliente/:id
    const clienteId = this.route.snapshot.paramMap.get('id');
    if (clienteId) {
      this.modoVisualizacaoPorId = true;
      this.buscarClientePorId(clienteId);
    }
  }

  // Buscar Cliente por ID
  buscarClientePorId(id: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Utilizando variável de ambiente para a URL da API de clientes
    this.http.get<any>(`${environment.consultaPessoasApi}/clientes/${id}`, { headers })
      .subscribe({
        next: (cliente) => {
          this.clienteForm.patchValue({
            nome: cliente.nome,
            cpf: cliente.cpf,
            pessoaId: cliente.pessoaId,
            clienteReg: cliente.clienteReg,
            clienteStatus: cliente.clienteStatus
          });
        },
        error: (err) => {
          console.error('Erro ao buscar cliente por ID:', err);
          alert('Erro ao carregar dados do cliente.');
        }
      });
  }

  // Formatar CPF
  formatarCpf(event: any): void {
    let cpf = event.target.value;
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }

    this.clienteForm.get('cpf')?.setValue(cpf);
  }

  // Pesquisa Pessoa e preenche o formulário com os dados da pessoa e do cliente (se encontrado)
  pesquisarPessoa(): void {
    const cpf = this.clienteForm.get('cpf')?.value?.replace(/\D/g, ''); // remove formatação

    if (!cpf) {
      alert('Informe um CPF válido.');
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // 🔹 Buscar dados da pessoa usando a URL de pessoas do ambiente
    this.http.get<any>(`${environment.cadastroPessoasApi}/pessoas/cpf/${cpf}`, { headers })
      .subscribe({
        next: (pessoa) => {
          const pessoaId = pessoa.id;
          const nome = pessoa.nome;

          // ⚠️ Primeiro preenche com os dados da pessoa
          this.clienteForm.patchValue({
            nome: nome,
            cpf: pessoa.cpf,
            pessoaId: pessoaId
          });

          // 🔹 Agora busca dados do cliente associado usando a URL de clientes do ambiente
          this.http.get<any>(`${environment.consultaPessoasApi}/clientes/pessoa/${pessoaId}`, { headers })
            .subscribe({
              next: (cliente) => {
                // Se o cliente for encontrado, preenche os dados
                this.clienteForm.patchValue({
                  clienteReg: cliente.clienteReg,
                  clienteStatus: cliente.clienteStatus
                });
              },
              error: (err) => {
                console.warn('Cliente não encontrado para esta pessoaId. Mostrando dados de pessoa.');
                // Limpa os campos do cliente caso não seja encontrado
                this.clienteForm.patchValue({
                  clienteReg: '',
                  clienteStatus: ''
                });
                alert('Cliente não encontrado para o pessoaId informado.');
              }
            });
        },
        error: (err) => {
          console.error('Erro ao buscar pessoa pelo CPF:', err);
          alert('Pessoa não encontrada para este CPF.');
        }
      });
  }

  // Voltar para a página anterior
  voltar(): void {
    window.history.back(); // Ou pode usar this.router.navigate para outro caminho
  }
}
