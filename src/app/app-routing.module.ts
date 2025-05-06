import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';

import { RegistrarComponent } from './components/login/pages/registrar/registrar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/login/pages/entrar/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CadastrarPessoaComponent } from './components/cadastrar-pessoa/cadastrar-pessoa.component';
import { CadastrarClienteComponent } from './components/clientes/cadastrar-cliente/cadastrar-cliente.component';
import { CadastrarFuncionarioComponent } from './components/funcionarios/cadastrar-funcionario/cadastrar-funcionario.component';
import { CadastrarEnderecoComponent } from './components/endereco/cadastrar-enderecos/cadastrar-endereco/cadastrar-endereco.component';
import { VisualizarClienteComponent } from './components/clientes/visualizar-cliente/visualizar-cliente.component';
import { VisualizarFuncionarioComponent } from './components/funcionarios/visualizar-funcionario/visualizar-funcionario.component';
import { VisualizarEnderecoComponent } from './components/endereco/visualizar-endereco/visualizar-endereco.component';
import { DecoracaoDetalhesComponent } from './components/decoracao/itens/decoracao-detalhes/decoracao-detalhes.component';
import { ListaProdutosComponent } from './decoracao/itens/lista-produtos/lista-produtos.component';
const routes: Routes = [
  {
    path: '', component: NavComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'registrar', component: RegistrarComponent },
      { path: 'login', component: LoginComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'cadastrar-pessoa', component: CadastrarPessoaComponent}, // Cadastrar Pessoa
      { path: 'clientes', component: CadastrarClienteComponent},
      { path: 'visualizar-cliente', component: VisualizarClienteComponent },
      { path: 'funcionarios', component: CadastrarFuncionarioComponent},
      { path: 'visualizar-funcionario', component: VisualizarFuncionarioComponent },
      { path: 'cadastrar-endereco', component: CadastrarEnderecoComponent },
      { path: 'visualizar-endereco', component: VisualizarEnderecoComponent },
      { path: 'detalhes-decoracao/:id', component: DecoracaoDetalhesComponent },
      { path: 'produtos', component: ListaProdutosComponent },
      { path: 'produto/:id', component: DecoracaoDetalhesComponent },
      { path: '', redirectTo: '/produtos', pathMatch: 'full' }

    ]
  },
  { path: '**', redirectTo: '' } // Redireciona rotas inválidas para a raiz
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
