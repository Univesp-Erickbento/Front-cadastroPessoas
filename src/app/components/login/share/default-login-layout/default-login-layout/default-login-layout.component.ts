import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-default-login-layout',
  templateUrl: './default-login-layout.component.html',
  styleUrls: ['./default-login-layout.component.css']
})
export class DefaultLoginLayoutComponent {

  // Título da tela de login
  @Input() title: string = "";

  // Texto dos botões
  @Input() primaryBtnText: string = "";
  @Input() secondaryBtnText: string = "";

  // Desabilita botão principal
  @Input() disablePrimaryBtn: boolean = true;

  // Eventos emitidos para o componente pai
  @Output() submit = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<void>();

  // Dispara evento de submit
  onSubmit() {
    this.submit.emit();
  }

  // Dispara evento de navegação
  onNavigate() {
    this.navigate.emit();
  }
}
