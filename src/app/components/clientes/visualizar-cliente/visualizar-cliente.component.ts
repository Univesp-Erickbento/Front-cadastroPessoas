import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

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

  buscarClientePorId(id: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:8080/api/clientes/${id}`, { headers })
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

  formatarCpf(event: any): void {
    let cpf = event.target.value;
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }

    this.clienteForm.get('cpf')?.setValue(cpf);
  }

  pesquisarPessoa(): void {
    const cpf = this.clienteForm.get('cpf')?.value;

    if (!cpf) {
      alert('Informe um CPF válido.');
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:8080/api/clientes/cpf/${cpf}`, { headers })
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
          console.error('Erro ao buscar cliente pelo CPF:', err);
          alert('Erro ao buscar cliente pelo CPF.');
        }
      });
  }

  voltar(): void {
    window.history.back(); // Ou pode usar this.router.navigate para outro caminho
  }
}
