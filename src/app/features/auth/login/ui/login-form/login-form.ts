import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@app/features/auth/login/model/auth.service';
import { passwordValidator } from '@shared/lib/password-validator';
import { Router } from '@angular/router';
import { UserService } from '@app/entities/user/model/user.service';
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
  private readonly router = inject(Router);
  private readonly loginService = inject(AuthService);
  private readonly userService = inject(UserService);

  loginForm = new FormGroup({
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
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.message.set('');

      const formValue = {
        password: this.loginForm.get('password')?.value || '',
        login: this.loginForm.get('login')?.value || '',
      };

      this.loginService.login(formValue).subscribe({
        next: (response) => {
          this.message.set(response.message);
          this.router.navigateByUrl('/dashboard');
          this.userService.me().subscribe({
            next: () => {
              this.router.navigateByUrl('/dashboard');
            },
            error: (error) => {
              console.error(error);
            },
          });
        },
        error: (error) => {
          this.message.set(this.loginService.getLoginErrorMessage(error));
        },
      });
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
