import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; // Importação do Router

import { environment } from '../../../../environments/environment'; // Importando as variáveis de ambiente

@Component({
  selector: 'app-visualizar-endereco',
  templateUrl: './visualizar-endereco.component.html',
  styleUrls: ['./visualizar-endereco.component.css']
})
export class VisualizarEnderecoComponent implements OnInit {

  enderecoForm!: FormGroup;
  enderecos: any[] = [];
  tiposDisponiveis: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router // Injeção do Router para navegação
  ) {}

  ngOnInit(): void {
    this.enderecoForm = this.fb.group({
      nome: [{ value: '', disabled: true }],
      cpf: [''],
      pessoaId: [''],
      tipoDeEndereco: [''],
      logradouro: [{ value: '', disabled: true }],
      numero: [{ value: '', disabled: true }],
      complemento: [{ value: '', disabled: true }],
      bairro: [{ value: '', disabled: true }],
      localidade: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      pais: [{ value: '', disabled: true }],
      cep: [{ value: '', disabled: true }]
    });
  }

  formatarCpf(event: any): void {
    let cpf = event.target.value.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    this.enderecoForm.get('cpf')?.setValue(cpf);
  }

  pesquisarPessoa(): void {
    const cpf = this.enderecoForm.get('cpf')?.value?.replace(/\D/g, '');
    if (!cpf) {
      alert('Informe um CPF válido.');
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Alterado para usar a chave consultaEnderecoApi do arquivo environment.ts
    this.http.get<any>(`${environment.consultaEnderecoApi}/enderecos/por-tipo?cpf=${cpf}`, { headers }).subscribe({
      next: response => {
        if (!response || !response.enderecosPorTipo) {
          alert('Endereços não encontrados.');
          return;
        }

        this.enderecoForm.patchValue({
          nome: response.nome,
          pessoaId: response.pessoaId
        });

        const tiposSet = new Set<string>();
        const enderecos: any[] = [];

        // Agrupar os endereços pelo tipo
        Object.values(response.enderecosPorTipo).forEach((grupo: any) => {
          grupo.forEach((tipoEnderecoObj: any) => {
            Object.entries(tipoEnderecoObj).forEach(([tipo, lista]: [string, any[]]) => {
              tiposSet.add(tipo);
              lista.forEach((end: any) => {
                enderecos.push(end);
              });
            });
          });
        });
        
        this.enderecos = enderecos;
        this.tiposDisponiveis = Array.from(tiposSet);

        if (this.tiposDisponiveis.length > 0) {
          this.enderecoForm.get('tipoDeEndereco')?.setValue(this.tiposDisponiveis[0]);
          this.preencherEndereco(this.tiposDisponiveis[0]);
        } else {
          alert('Nenhum endereço encontrado.');
        }
      },
      error: () => {
        alert('Erro ao buscar dados da pessoa e seus endereços.');
      }
    });
  }

  preencherEndereco(tipo: string): void {
    const endereco = this.enderecos.find(e => e.tipoDeEndereco === tipo);
    if (endereco) {
      this.enderecoForm.patchValue({
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        localidade: endereco.localidade,
        estado: endereco.estado, // Corrigido para 'estado' e não 'uf'
        pais: endereco.pais,
        cep: endereco.cep
      });
    }
  }

  onTipoEnderecoChange(): void {
    const tipo = this.enderecoForm.get('tipoDeEndereco')?.value;
    this.preencherEndereco(tipo);
  }

  navegarParaLista(): void {
    this.router.navigate(['/enderecos']); // Altere a rota conforme o caminho correto no seu projeto
  }
}
