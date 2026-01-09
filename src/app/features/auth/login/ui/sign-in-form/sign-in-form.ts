import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../model/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { passwordValidator } from '@app/shared/lib/password-validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

interface ISignInForm {
  onSubmit: () => void;
}

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.scss',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  providers: [AuthService],
})
export class SignInForm implements ISignInForm {
  private readonly authService = inject(AuthService);
  protected readonly message = signal<{
    message: string;
    error: string;
  }>({ message: '', error: '' });

  private passwordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  signInForm = new FormGroup(
    {
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        passwordValidator(),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
    },
    { validators: this.passwordMatchValidator },
  );

  onSubmit() {
    if (this.signInForm.valid && this.signInForm.get('password')?.valid) {
      this.message.set({ message: '', error: '' });

      const password = this.signInForm.get('password')?.value || '';

      if (!this.isPasswordValid(password)) {
        this.message.set({
          message: '',
          error: 'Пароль не соответствует требованиям безопасности',
        });
        return;
      }

      this.authService
        .signIn({
          password: password,
          login: this.signInForm.get('login')?.value || '',
          email: this.signInForm.get('email')?.value || '',
        })
        .subscribe({
          next: (response) => {
            this.message.set({ message: response.message, error: '' });
          },
          error: (error) => {
            const errorMessage =
              error?.error?.message ||
              error?.error?.error ||
              error?.message ||
              'Произошла ошибка при регистрации';
            this.message.set({ message: '', error: errorMessage });
            console.error('Sign in error:', error);
          },
        });
    } else {
      // Если форма невалидна, помечаем все поля как touched для отображения ошибок
      Object.keys(this.signInForm.controls).forEach((key) => {
        this.signInForm.get(key)?.markAsTouched();
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
