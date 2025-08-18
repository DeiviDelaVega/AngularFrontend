import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

type LoginDTO = { email: string; password: string; captcha?: string };

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  error = '';

  // 👇 inyecta sin constructor; ya puedes usarlo en inicializadores
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    captcha: ['']
  });

  submit() {
    if (this.form.invalid) return;
    const dto: LoginDTO = this.form.getRawValue();
    this.auth.login(dto).subscribe({
      next: r => this.router.navigateByUrl(r.role === 'ROLE_admin' ? '/admin' : '/cliente'),
      error: () => this.error = 'Correo o contraseña inválidos'
    });
  }
}
