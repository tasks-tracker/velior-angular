import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { API_URL } from '@app/shared/config/api.config';
import { Subscription } from 'rxjs';

export interface User {
  id: string;
  login: string;
  registeredAt: string;
  settings: {
    avatar_url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  private subscription: Subscription | null = null;

  user = signal<User | null>(null);
  error = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  me() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.isLoading.set(true);

    this.subscription = this.http.get<User>(`${this.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.user.set(user);
        this.subscription = null;
      },
      error: (error) => {
        this.isLoading.set(false);
        this.error.set(error.error);
        this.subscription = null;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
