import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@app/features/auth/login/model/auth.service';
import { passwordValidator } from '@shared/lib/password-validator';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [AuthService],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  protected readonly message = signal<string>('');

  private readonly loginService = inject(AuthService);

  loginForm = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      passwordValidator(),
    ]),
  });

  onSubmit() {
    if (this.loginForm.valid && this.loginForm.get('password')?.valid) {
      this.message.set('');

      const password = this.loginForm.get('password')?.value || '';

      if (!this.isPasswordValid(password)) {
        this.message.set('Пароль не соответствует требованиям безопасности');
        return;
      }

      this.loginService
        .login({
          password: password,
          login: this.loginForm.get('login')?.value || '',
        })
        .subscribe({
          next: (response) => {
            this.message.set(response.message);
          },
          error: (error) => {
            const errorMessage =
              error?.error?.message ||
              error?.error?.error ||
              error?.message ||
              'Произошла ошибка при входе';
            this.message.set(errorMessage);
            console.error('Login error:', error);
          },
        });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  private isPasswordValid(password: string): boolean {
    if (!password) return false;

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    return hasLowercase && hasUppercase && hasDigit && hasSpecial && password.length >= 6;
  }
}
