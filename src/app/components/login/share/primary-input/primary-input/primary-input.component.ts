import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type InputTypes = "text" | "email" | "password";

@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ],
  templateUrl: './primary-input.component.html',
  styleUrls: ['./primary-input.component.css']
})
export class PrimaryInputComponent implements ControlValueAccessor {

  @Input() type: InputTypes = "text";
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() inputName: string = "";

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  // Atualiza o valor quando o usuário digita
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value); // Chama a função onChange fornecida pelo formulário
  }

  // Implementação do ControlValueAccessor
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;  // Atualiza o valor do input quando o valor do formulário mudar
    }
  }

  // Registra a função que será chamada quando o valor do campo mudar
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra a função que será chamada quando o campo for tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Define o estado desabilitado do componente
  setDisabledState(isDisabled: boolean): void {
    // Aqui você pode adicionar lógica para desabilitar o input, se necessário
    // Exemplo: this.disabled = isDisabled;
  }
}
