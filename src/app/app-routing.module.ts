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
import { FuncionarioComponent } from './components/funcionarios/funcionarios.component';
import { CadastrarEnderecoComponent } from './components/cadastrar-enderecos/cadastrar-endereco/cadastrar-endereco.component';
import { VisualizarClienteComponent } from './components/clientes/visualizar-cliente/visualizar-cliente.component';

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
      { path: 'funcionarios', component: FuncionarioComponent},
      { path: 'cadastrar-endereco', component: CadastrarEnderecoComponent },
    ]
  },
  { path: '**', redirectTo: '' } // Redireciona rotas inválidas para a raiz
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
