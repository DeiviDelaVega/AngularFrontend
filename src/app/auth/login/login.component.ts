import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CaptchaResponse } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = '';
  loading = false;
  captcha?: CaptchaResponse;
  success = ''; // Nuevo mensaje de éxito

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    // 👇 estos 2 son los que tu backend espera
    captchaId: [''],
    captchaCode: ['', [Validators.required]]
  });

  constructor() {
    this.refreshCaptcha();

    // Verifica si hay mensaje de logout
    const logoutMsg = localStorage.getItem('logoutMessage');
    if (logoutMsg) {
      this.success = logoutMsg;  
      localStorage.removeItem('logoutMessage');
    }
  }

  refreshCaptcha() {
    this.auth.getCaptcha().subscribe({
      next: c => {
        this.captcha = c;
        this.form.patchValue({ captchaId: c.captchaId });
      },
      error: _ => this.error = 'No se pudo cargar el captcha'
    });
  }

  submit() {
    // Fuerza que se muestren las validaciones
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.error = '';
    this.loading = true;

    const v = this.form.getRawValue();
    this.auth.login({
      email: v.email,
      password: v.password,
      captchaId: v.captchaId!,
      captchaCode: v.captchaCode!
    }).subscribe({
      next: _ => {
        // Confía en lo guardado por el AuthService (ya normalizado)
        const role = localStorage.getItem('role');
        const url = role === 'ROLE_admin' ? '/admin' : '/cliente';
        this.router.navigateByUrl(url, { replaceUrl: true });
        this.loading = false;
      },
      error: _ => {
        this.error = 'Correo, contraseña o captcha incorrecto';
        this.success = '';
        this.loading = false;
        this.form.patchValue({ captchaCode: '' });
        this.refreshCaptcha(); // Genera otro captcha tras el fallo
      }
    });
  }
}
