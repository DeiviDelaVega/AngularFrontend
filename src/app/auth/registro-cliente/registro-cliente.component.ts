// src/app/auth/registro-cliente/registro-cliente.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-registro-cliente',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro-cliente.component.html'
})
export class RegistroClienteComponent {
  ok = '';
  err = '';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nroDocumento: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      direccion: ['', Validators.required],
      numeroTelf: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.auth.registroCliente(this.form.value).subscribe({
      next: () => {
        this.ok = 'Registro exitoso. Redirigiendo…';
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: () => this.err = 'No se pudo registrar'
    });
  }
}
