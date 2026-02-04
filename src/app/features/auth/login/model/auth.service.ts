import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@shared/config/api.config';
import { Observable, catchError, throwError } from 'rxjs';

interface ILogin {
  password: string;
  login: string;
}

interface ISignIn {
  password: string;
  login: string;
  email: string;
}

interface AuthResponse {
  message: string;
}

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  login({ password, login }: ILogin): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, {
        password,
        login,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  signIn({ password, login, email }: ISignIn): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register-by-login`, {
        password,
        login,
        email,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = this.extractErrorMessage(error);
    console.error('Auth error:', error);
    return throwError(() => ({ message: errorMessage }));
  }

  /**
   * Извлечение сообщения об ошибке из ответа сервера
   */
  private extractErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.error?.error) {
      return error.error.error;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Произошла ошибка при выполнении запроса';
  }

  getSignInErrorMessage(error: any): string {
    return this.extractErrorMessage(error) || 'Произошла ошибка при регистрации';
  }

  getLoginErrorMessage(error: any): string {
    return this.extractErrorMessage(error) || 'Произошла ошибка при входе';
  }
}
