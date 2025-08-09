// src/app/auth/registro-admin/registro-admin.component.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

type RegistroAdminDTO = {
  nombre: string;
  apellido: string;
  nroDocumento: string;
  telefono: string;
  correo: string;
  clave: string;
};

@Component({
  standalone: true,
  selector: 'app-registro-admin',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro-admin.component.html'
})
export class RegistroAdminComponent {
  ok = '';
  err = '';

  // inyección moderna (evita "used before initialization")
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // controles no–null
  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    nroDocumento: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    const dto: RegistroAdminDTO = this.form.getRawValue();
    this.auth.registroAdmin(dto).subscribe({
      next: () => {
        this.ok = 'Administrador registrado. Redirigiendo…';
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: () => this.err = 'No se pudo registrar el administrador'
    });
  }
}
