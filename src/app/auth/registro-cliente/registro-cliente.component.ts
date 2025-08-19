// src/app/auth/registro-cliente/registro-cliente.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

type RegistroClienteDTO = {
  nombre: string;
  apellido: string;
  nroDocumento: string;
  direccion: String;
  numeroTelf: string;
  correo: string;
  clave: string;
};

@Component({
  standalone: true,
  selector: 'app-registro-cliente',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.scss']
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
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      nroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      numeroTelf: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      clave: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Fuerza que todos los campos muestren su error
      return;
    }
    const dto: RegistroClienteDTO = this.form.getRawValue();
    this.auth.registroCliente(dto).subscribe({
      next: () => {
        this.ok = 'Registro exitoso. Redirigiendo…';
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: () => this.err = 'No se pudo registrar'
    });
  }
}
