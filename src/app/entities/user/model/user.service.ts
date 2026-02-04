import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { API_URL } from '@app/shared/config/api.config';
import { catchError, finalize, Observable, Subscription, tap, throwError } from 'rxjs';

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
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  user = signal<User | null>(null);
  error = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  me(): Observable<User> {
    this.isLoading.set(true);
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => {
        this.user.set(user);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.error.set(error.error);
        this.isLoading.set(false);
        return throwError(() => error);
      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.user.set(null);
        this.error.set(null);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.error.set(error.error);
        return throwError(() => error);
      })
    );
  }
}
