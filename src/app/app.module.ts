import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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

import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistrarComponent } from './components/login/registrar/registrar.component';
import { LoginComponent } from './components/login/entrar/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CadastrarPessoaComponent } from './components/cadastrar-pessoa/cadastrar-pessoa.component';
import { ClienteComponent } from './components/clientes/clientes.component';
import { FuncionarioComponent } from './components/funcionarios/funcionarios.component';
import { CadastrarEnderecoComponent } from './components/cadastrar-enderecos/cadastrar-endereco/cadastrar-endereco.component'; 

// Serviços
import { PessoaService } from './components/cadastrar-pessoa/PessoaService';
import { BuscarCepService } from './services/buscar.cep.service';  
import { AuthService } from './services/auth.service';  // Importando o serviço de autenticação
import { AuthInterceptor } from './services/auth.interceptor';  // Importando o Interceptor

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    PerfilComponent,
    RegistrarComponent,
    LoginComponent,
    SettingsComponent,
    CadastrarPessoaComponent,
    ClienteComponent,
    FuncionarioComponent,
    CadastrarEnderecoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCheckboxModule,
    HttpClientModule
  ],
  providers: [
    PessoaService,
    BuscarCepService,  // Serviço para buscar CEP
    AuthService,  // Serviço de autenticação
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,  // Registrando o AuthInterceptor
      multi: true  // Permite múltiplos interceptors
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
