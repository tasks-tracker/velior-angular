import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL } from '@app/shared/config/api.config';
import { Observable, tap, catchError, of, throwError, finalize } from 'rxjs';


interface User {
  id: string;
  login: string;
  email: string;
  created_at: string;
  updated_at: string;
  settings: {
    avatar_url: string;
  }
  conversation_id: string;
}

interface SearchUsersResponse {
  users: User[]
}



@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly path = `${this.apiUrl}/auth/search-users`;

  readonly users = signal<User[] | null>(null);
  readonly error = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);

  searchUsers(query: string) {
    this.isLoading.set(true)
    return this.http.get<SearchUsersResponse>(`${this.path}?query=${query}`)
    .pipe(
      tap((response) => {
        this.isLoading.set(false);
        this.users.set(response.users)
      }),
      catchError((error) => {
        this.error.set(error.error?.message || 'Произошла ошибка при поиске пользователей');
        return throwError(() => error);
      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    )
  }
}
