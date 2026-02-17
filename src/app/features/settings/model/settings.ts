import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL } from '@app/shared/config/api.config';

type SettingsPayload = {
  avatarFile?: File | null;
  email?: string | null;
  password?: string | null;
  login?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly API = inject(API_URL);
  private readonly API_URL = `${this.API}/user-settings`;

  isLoading = signal(false);
  message = signal('');
  error = signal<{ message: string } | null>(null);

  updateSettings(settings: SettingsPayload) {
    this.isLoading.set(true);
    this.error.set(null);
    this.message.set('');
    return this.http.patch(`${this.API_URL}/update`, settings).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.error.set(null);
        this.message.set('Настройки сохранены');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.message.set('');
        this.error.set(err.error && typeof err.error === 'object' ? err.error : { message: err.message ?? 'Ошибка сохранения' });
      },
    });
  }
}
