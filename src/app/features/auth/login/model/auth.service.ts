import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@shared/config/api.config';
import { Observable } from 'rxjs';

interface ILogin {
  password: string;
  login: string;
}

interface ISignIn {
  password: string;
  login: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  login({ password, login }: ILogin): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/login`, {
      password,
      login,
    });
  }

  signIn({ password, login, email }: ISignIn): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/register-by-login`, {
      password,
      login,
      email,
    });
  }
}
