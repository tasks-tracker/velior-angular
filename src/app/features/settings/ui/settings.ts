import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { UserService } from '@app/entities/user/model/user.service';
import { passwordValidator } from '@app/shared/lib/password-validator';
import { UserAvatar } from '@app/entities/user/ui/user-avatar/user-avatar';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    UserAvatar,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);

  protected avatarPreviewUrl: string | null = null;
  protected avatarFile: File | null = null;

  protected get displayAvatarUrl(): string {
    if (this.avatarPreviewUrl) return this.avatarPreviewUrl;
    return this.user?.settings?.avatar_url ?? '';
  }

  protected get displayUserName(): string {
    return this.settingsForm.get('login')?.value || this.user?.login || '';
  }

  protected onAvatarFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return;
    }
    this.avatarFile = file;
    if (this.avatarPreviewUrl) URL.revokeObjectURL(this.avatarPreviewUrl);
    this.avatarPreviewUrl = URL.createObjectURL(file);
    input.value = '';
  }

  protected clearAvatarFile(): void {
    if (this.avatarPreviewUrl) {
      URL.revokeObjectURL(this.avatarPreviewUrl);
    }
    this.avatarPreviewUrl = null;
    this.avatarFile = null;
  }

  protected settingsForm = new FormGroup(
    {
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [
        Validators.minLength(6),
        passwordValidator(),
      ]),
      confirmPassword: new FormControl(''),
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    const user = this.userService.user();
    if (user) {
      this.settingsForm.patchValue({
        login: user.login,
      });
    }
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && (!confirmPassword || password !== confirmPassword)) {
      return { passwordMismatch: true };
    }
    return null;
  }

  protected onSubmit(): void {
    if (this.settingsForm.valid) {
      const value = this.settingsForm.getRawValue();
      // TODO: вызов API обновления профиля (avatarFile — загруженный файл, если выбран)
      console.log('Settings submit', { ...value, avatarFile: this.avatarFile });
    } else {
      this.markFormFieldsAsTouched();
    }
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.settingsForm.controls).forEach((key) => {
      this.settingsForm.get(key)?.markAsTouched();
    });
  }

  protected get user() {
    return this.userService.user();
  }

  ngOnDestroy(): void {
    this.clearAvatarFile();
  }
}
