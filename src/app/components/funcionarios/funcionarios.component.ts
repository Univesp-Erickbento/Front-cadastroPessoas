import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionarioComponent implements OnInit {
  funcionarioForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.funcionarioForm = this.fb.group({
      id: [{ value: this.gerarId(), disabled: true }],
      tipo: ['', Validators.required],
      funcionarioRg: ['', Validators.required],
      funcionarioStatus: ['', Validators.required],
      dataDeAdmissao: ['', Validators.required]
    });
  }

  gerarId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  onSubmit() {
    if (this.funcionarioForm.valid) {
      console.log('Funcionário cadastrado:', this.funcionarioForm.value);
    }
  }
}
