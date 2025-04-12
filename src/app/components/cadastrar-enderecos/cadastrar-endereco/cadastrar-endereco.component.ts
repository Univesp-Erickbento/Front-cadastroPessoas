import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) {
    this.enderecoForm = this.fb.group({
      cpf: ['', Validators.required],
      pessoaId: [{value: '', disabled: true}],  // Campo 'pessoaId' que não pode ser alterado
      cep: ['', [Validators.required, Validators.pattern('[0-9]{5}-[0-9]{3}')]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      localidade: ['', Validators.required],
      estado: ['', Validators.required],
      pais: ['Brasil', Validators.required],
      perfil: ['', Validators.required],
      tipoDeEndereco: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Verificando se o CPF e o pessoaId vieram na URL
    this.route.queryParams.subscribe(params => {
      const cpf = params['cpf'];
      const pessoaId = params['pessoaId'];

      if (cpf) {
        this.enderecoForm.get('cpf')?.setValue(cpf);
      }
      if (pessoaId) {
        this.enderecoForm.get('pessoaId')?.setValue(pessoaId);
      }
    });
  }

  onSubmit() {
    if (this.enderecoForm.valid) {
      const endereco = this.enderecoForm.value;
      console.log('Endereço cadastrado:', endereco);
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

    this.http.get<any>(`http://192.168.15.200:9090/api/pessoas/cpf/${cpf}`)
      .subscribe(response => {
        if (response) {
          // Se a pessoa for encontrada, preenche o campo pessoaId com o ID da pessoa
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
    const cepFormatado = cep.replace('-', ''); // Remove o hífen, caso tenha

    if (cepFormatado && cepFormatado.length === 8) {
      this.buscarCepService.buscarCep(cepFormatado).subscribe((dados) => {
        if (dados && !dados.erro) {
          // Preenche os campos do formulário com os dados retornados pela API
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
    cep = cep.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
    if (cep.length <= 5) {
      cep = cep.replace(/(\d{5})(\d{1,3})?/, '$1-$2');
    } else {
      cep = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    this.enderecoForm.get('cep')?.setValue(cep);
  }
}
