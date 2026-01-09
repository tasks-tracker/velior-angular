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
    if (this.signInForm.valid) {
      this.message.set({ message: '', error: '' });

      const formValue = {
        password: this.signInForm.get('password')?.value || '',
        login: this.signInForm.get('login')?.value || '',
        email: this.signInForm.get('email')?.value || '',
      };

      this.authService.signIn(formValue).subscribe({
        next: (response) => {
          this.message.set({ message: response.message, error: '' });
        },
        error: (error) => {
          this.message.set({
            message: '',
            error: this.authService.getSignInErrorMessage(error),
          });
        },
      });
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.signInForm.controls).forEach((key) => {
      this.signInForm.get(key)?.markAsTouched();
    });
  }
}
