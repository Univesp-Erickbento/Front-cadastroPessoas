import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClienteComponent implements OnInit {
  clienteForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.clienteForm = this.fb.group({
      id: [{ value: this.gerarId(), disabled: true }],
      rg: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  gerarId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      console.log('Cliente cadastrado:', this.clienteForm.value);
    }
  }
}
