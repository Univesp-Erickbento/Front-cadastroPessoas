import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EntrarComponent } from './components/entrar/entrar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CadastrarPessoaComponent } from './components/cadastrar-pessoa/cadastrar-pessoa.component';
import { ClienteComponent } from './components/clientes/clientes.component';
import { FuncionarioComponent } from './components/funcionarios/funcionarios.component';

const routes: Routes = [
  {
    path: '', component: NavComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'cadastro', component: LoginComponent },
      { path: 'entrar', component: EntrarComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'cadastrar-pessoa', component: CadastrarPessoaComponent},
      { path: 'clients', component: ClienteComponent},
      { path: 'funcionarios', component: FuncionarioComponent},
    ]
  },
  { path: '**', redirectTo: '' } // Redireciona rotas inválidas para a raiz
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
