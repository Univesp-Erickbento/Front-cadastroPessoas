import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatFormField } from '@angular/material/form-field';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClienteComponent implements OnInit, AfterViewInit {
  clienteForm!: FormGroup;
  nome: string | null = null;
  cpf: string | null = null;
  pessoaId: string | null = null;

  @ViewChildren(MatFormField) formFields!: QueryList<MatFormField>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nome = params['nome'] || null;
      this.cpf = params['cpf'] || null;
      this.pessoaId = params['pessoaId'] || null;
    });

    this.clienteForm = this.fb.group({
      id: [{ value: this.gerarId(), disabled: true }],
      nome: [{ value: this.nome, disabled: true }],
      cpf: [this.cpf || '', Validators.required],
      pessoaId: [this.pessoaId || ''],
      clienteReg: ['', Validators.required],  // Ajustado para clienteReg
      clienteStatus: ['', Validators.required]
    });
    

    if (this.nome) {
      this.clienteForm.patchValue({ nome: this.nome });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
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
    const token = this.authService.getToken();
    console.log('🔐 Token no onSubmit:', token);

    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }

    const formRaw = this.clienteForm.getRawValue();
    console.log('📝 Form Raw:', formRaw);

    if (this.clienteForm.valid) {
      const clienteDTO = {
        pessoaId: formRaw.pessoaId,
        cpf: formRaw.cpf.replace(/\D/g, ''),
        clienteReg: formRaw.clienteReg,  // Ajustado para clienteReg
        clienteStatus: formRaw.clienteStatus,
        dataDeCadastro: new Date()
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.post('http://localhost:8080/api/clientes/adicionar', clienteDTO, { headers })
        .subscribe({
          next: () => {
            alert('✅ Cliente cadastrado com sucesso!');
            this.router.navigate(['/lista-clientes']);
          },
          error: (err) => {
            console.error('❌ Erro ao cadastrar cliente:', err);
            const message = err.error?.message || 'Erro ao cadastrar cliente.';
            alert(message);
          }
        });

    } else {
      alert('Preencha todos os campos obrigatórios e selecione uma pessoa antes de continuar.');
    }
  }

  voltar(): void {
    this.router.navigate(['/cadastrar-pessoa']);
  }

  pesquisarPessoa(): void {
    const cpfPesquisado = this.clienteForm.get('cpf')?.value.replace(/\D/g, '');

    if (cpfPesquisado) {
      const token = this.authService.getToken();

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get(`http://localhost:9090/api/pessoas?cpf=${cpfPesquisado}`, { headers })
        .subscribe(
          (response: any) => {
            if (response && response.nome && response.id) {
              this.nome = response.nome;
              this.cpf = response.cpf;
              this.pessoaId = response.id;

              this.clienteForm.patchValue({
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
