import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BuscarCepService } from '../../../../services/buscar.cep.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-cadastrar-endereco',
  templateUrl: './cadastrar-endereco.component.html',
  styleUrls: ['./cadastrar-endereco.component.css']
})
export class CadastrarEnderecoComponent implements OnInit {
  enderecoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private buscarCepService: BuscarCepService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.enderecoForm = this.fb.group({
      nome: [{ value: null, disabled: true }],
      cpf: [null, Validators.required],
      pessoaId: [null],
      cep: [null, [Validators.required, Validators.pattern('[0-9]{5}-[0-9]{3}')]],
      logradouro: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null],
      bairro: [null, Validators.required],
      localidade: [null, Validators.required],
      estado: [null, Validators.required],
      pais: ['Brasil', Validators.required],
      perfil: [null, Validators.required],
      tipoDeEndereco: [null, Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.enderecoForm.patchValue({
        nome: params['nome'],
        cpf: params['cpf'],
        pessoaId: params['pessoaId']
      });
    });
  }

  onSubmit() {
    if (this.enderecoForm.valid) {
      const rawForm = this.enderecoForm.getRawValue();
      const enderecoDTO = {
        cpf: rawForm.cpf.replace(/\D/g, ''),
        numero: rawForm.numero,
        complemento: rawForm.complemento,
        bairro: rawForm.bairro,
        cep: rawForm.cep,
        pais: rawForm.pais,
        logradouro: rawForm.logradouro,
        localidade: rawForm.localidade,
        uf: rawForm.estado,
        tipoDeEndereco: rawForm.tipoDeEndereco?.toUpperCase()
      };

      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      this.http.post(
        `${environment.salvarEnderecoApi}/salvar-endereco`,
        enderecoDTO,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      ).subscribe({
        next: (response) => {
          console.log('Endereço cadastrado com sucesso:', response);
          alert('Endereço cadastrado com sucesso!');
          this.router.navigate(['/lista-enderecos']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar endereço:', error);
          const msg = error.error?.message || 'Erro ao salvar o endereço.';
          alert(msg);
        }
      });

    } else {
      console.warn('Formulário inválido!', this.enderecoForm.value);
      Object.keys(this.enderecoForm.controls).forEach(campo => {
        const control = this.enderecoForm.get(campo);
        if (control && control.invalid) {
          console.warn(`Campo "${campo}" está inválido. Erros:`, control.errors);
        }
      });
      this.enderecoForm.markAllAsTouched();
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.enderecoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  pesquisarPessoa() {
    const cpf = this.enderecoForm.get('cpf')?.value;
    if (!cpf) {
      alert('Por favor, preencha o CPF!');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    const cpfNumerico = cpf.replace(/\D/g, '');

    this.http.get<any>(`${environment.cadastroPessoasApi}/pessoas/cpf/${cpfNumerico}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe(
      response => {
        if (response) {
          this.enderecoForm.patchValue({
            nome: response.nome,
            pessoaId: response.id
          });
          console.log('Pessoa encontrada:', response);
        } else {
          alert('Pessoa não encontrada.');
        }
      },
      error => {
        alert('Erro ao buscar pessoa.');
        console.error(error);
      }
    );
  }

  buscarEnderecoPorCep() {
    let cep = this.enderecoForm.get('cep')?.value;
    const cepFormatado = cep?.replace('-', '');

    if (cepFormatado && cepFormatado.length === 8) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      this.buscarCepService.buscarCep(cepFormatado).subscribe((dados) => {
        if (dados && !dados.erro) {
          this.enderecoForm.patchValue({
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            localidade: dados.localidade,
            estado: dados.uf
          });
        } else {
          alert('CEP não encontrado!');
        }
      });
    } else {
      alert('CEP inválido!');
    }
  }

  formatarCep() {
    let cep = this.enderecoForm.get('cep')?.value;
    cep = cep?.replace(/\D/g, '');
    if (cep.length <= 5) {
      cep = cep.replace(/(\d{5})(\d{1,3})?/, '$1-$2');
    } else {
      cep = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    this.enderecoForm.get('cep')?.setValue(cep);
  }

  formatarCpf(event: Event) {
    const cpfControl = this.enderecoForm.get('cpf');
    if (cpfControl) {
      let valor = (event.target as HTMLInputElement).value.replace(/\D/g, '');
      if (valor.length > 11) valor = valor.slice(0, 11);

      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      cpfControl.setValue(valor, { emitEvent: false });
    }
  }

  navegarParaLista() {
    this.router.navigate(['/lista-enderecos']);
  }
}
