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

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    // 👇 estos 2 son los que tu backend espera
    captchaId: [''],
    captchaCode: ['', Validators.required]
  });

  constructor() {
    this.refreshCaptcha();
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
        // confía en lo guardado por el AuthService (ya normalizado)
        const role = localStorage.getItem('role');
        const url = role === 'ROLE_admin' ? '/admin' : '/cliente';
        this.router.navigateByUrl(url, { replaceUrl: true });
        this.loading = false;
      },
      error: _ => {
        this.error = 'Captcha o credenciales inválidos';
        this.loading = false;
        this.form.patchValue({ captchaCode: '' });
        this.refreshCaptcha(); // genera otro captcha tras el fallo
      }
    });
  }
}
