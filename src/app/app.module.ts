import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';

// Rotas
import { AppRoutingModule } from './app-routing.module';

// Componentes
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistrarComponent } from './components/login/pages/registrar/registrar.component';
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

// Login shared (NÃO standalone)
import { DefaultLoginLayoutComponent } from './components/login/share/default-login-layout/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from './components/login/share/primary-input/primary-input/primary-input.component';

// Login standalone
import { UserComponent } from './components/login/pages/user/user.component';

// Serviços
import { PessoaService } from './components/cadastrar-pessoa/PessoaService';
import { BuscarCepService } from './services/buscar.cep.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    MenuComponent,
    PerfilComponent,
    RegistrarComponent,
    LoginComponent,
    SettingsComponent,
    CadastrarPessoaComponent,
    CadastrarClienteComponent,
    CadastrarFuncionarioComponent,
    CadastrarEnderecoComponent,
    VisualizarClienteComponent,
    VisualizarFuncionarioComponent,
    VisualizarEnderecoComponent,
    DecoracaoDetalhesComponent,
    ListaProdutosComponent,

    // ✅ SOMENTE COMPONENTES NÃO-STANDALONE
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatOptionModule,

    // ✅ COMPONENTE STANDALONE
    UserComponent
  ],
  providers: [
    PessoaService,
    BuscarCepService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
