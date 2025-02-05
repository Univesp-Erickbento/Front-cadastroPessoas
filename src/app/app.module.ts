import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

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

import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/login/login.component';
import { EntrarComponent } from './components/entrar/entrar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CadastrarPessoaComponent } from './components/cadastrar-pessoa/cadastrar-pessoa.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    HeaderComponent,
    PerfilComponent,
    LoginComponent,
    EntrarComponent,
    SettingsComponent,
    CadastrarPessoaComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
