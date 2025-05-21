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
import { environment } from 'src/environments/environment';  // Importando o ambiente

@Component({
  selector: 'app-cadastrar-cliente',
  templateUrl: './cadastrar-cliente.component.html',
  styleUrls: ['./cadastrar-cliente.component.css']
})

export class CadastrarClienteComponent implements OnInit, AfterViewInit {

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
    // Recebe os parâmetros da URL se existirem
    this.route.queryParams.subscribe(params => {
      this.nome = params['nome'] || null;
      this.cpf = params['cpf'] || null;
      this.pessoaId = params['pessoaId'] || null;
    });

    // Inicializa o formulário
    this.clienteForm = this.fb.group({
      id: [{ value: this.gerarId(), disabled: true }],
      nome: [{ value: this.nome, disabled: true }],
      cpf: [this.cpf || '', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],  // CPF com validação de formato
      pessoaId: [this.pessoaId || ''],
      clienteReg: ['', Validators.required],
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
    let cpf = input.value.replace(/\D/g, '');  // Remove não numéricos
  
    // Aplica máscara ao CPF
    if (cpf.length > 11) cpf = cpf.substring(0, 11);
    cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, '$1.$2.$3-$4');
  
    this.clienteForm.get('cpf')?.setValue(cpf);
  }
  

  onSubmit(): void {
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
        clienteReg: formRaw.clienteReg,
        clienteStatus: formRaw.clienteStatus,
        dataDeCadastro: new Date()
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.post(environment.cadastroClienteApi + '/clientes/adicionar', clienteDTO, { headers })
        .subscribe({
          next: () => {
            alert('✅ Cliente cadastrado com sucesso!');
            // Navegar para a página de cadastro de endereço e passar os parâmetros
            this.router.navigate(['/cadastrar-endereco'], {
              queryParams: {
                pessoaId: formRaw.pessoaId,
                cpf: formRaw.cpf.replace(/\D/g, '')  // Corrigindo a sintaxe
              }
            });
            
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

      this.http.get(environment.cadastroPessoasApi + `/pessoas/cpf/${cpfPesquisado}`, { headers })

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
