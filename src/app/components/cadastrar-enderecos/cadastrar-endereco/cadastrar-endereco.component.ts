import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BuscarCepService } from '../../../services/buscar.cep.service';

@Component({
  selector: 'app-cadastrar-endereco',
  templateUrl: './cadastrar-endereco.component.html',
  styleUrls: ['./cadastrar-endereco.component.css']
})
export class CadastrarEnderecoComponent implements OnInit {
  enderecoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private buscarCepService: BuscarCepService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.enderecoForm = this.fb.group({
      cpf: ['', Validators.required],
      pessoaId: [{ value: '', disabled: true }],
      cep: ['', [Validators.required, Validators.pattern('[0-9]{5}-[0-9]{3}')]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      localidade: ['', Validators.required],
      estado: ['', Validators.required],
      pais: ['Brasil', Validators.required],
      perfil: ['', Validators.required],
      tipoDeEndereco: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const cpf = params['cpf'];
      const pessoaId = params['pessoaId'];

      if (cpf) this.enderecoForm.get('cpf')?.setValue(cpf);
      if (pessoaId) this.enderecoForm.get('pessoaId')?.setValue(pessoaId);
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
        tipoDeEndereco: rawForm.tipoDeEndereco.toUpperCase()
      };

      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      this.http.post(
        'http://localhost:7080/api/enderecos/salvar-endereco',
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
      console.warn('Formulário inválido!');
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

    this.http.get<any>(`http://192.168.15.200:9090/api/pessoas/cpf/${cpf}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe(response => {
      if (response) {
        this.enderecoForm.get('pessoaId')?.setValue(response.id);
        console.log('Pessoa encontrada:', response);
      } else {
        alert('Pessoa não encontrada.');
      }
    }, error => {
      alert('Erro ao buscar pessoa.');
      console.error(error);
    });
  }

  buscarEnderecoPorCep() {
    let cep = this.enderecoForm.get('cep')?.value;
    const cepFormatado = cep.replace('-', '');

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
    cep = cep.replace(/\D/g, '');
    if (cep.length <= 5) {
      cep = cep.replace(/(\d{5})(\d{1,3})?/, '$1-$2');
    } else {
      cep = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    this.enderecoForm.get('cep')?.setValue(cep);
  }

  // ✅ Novo método para corrigir o erro do CPF formatado
  formatarCpf() {
    const cpfControl = this.enderecoForm.get('cpf');
    if (cpfControl) {
      let valor = cpfControl.value.replace(/\D/g, '');
      if (valor.length > 11) valor = valor.slice(0, 11);

      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      cpfControl.setValue(valor, { emitEvent: false });
    }
  }

  // ✅ Novo método para navegação sem erro
  navegarParaLista() {
    this.router.navigate(['/lista-enderecos']);
  }
}
