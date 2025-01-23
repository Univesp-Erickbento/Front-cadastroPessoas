import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NavComponent } from './components/nav/nav.component';

import {MatSidenavModule} from '@angular/material/sidenav';

import { MatList, MatListModule } from '@angular/material/list';
import { HomeComponent } from './components/home/home.component';

import {MatCardModule} from '@angular/material/card';
import { HeaderComponent } from './components/header/header.component';
import { TecnicoComponent } from './components/tecnico/tecnico.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    HeaderComponent,
    TecnicoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule, 
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
