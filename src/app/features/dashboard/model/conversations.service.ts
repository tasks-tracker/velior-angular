import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL } from '@app/shared/config/api.config';
import { Observable, tap, catchError, of, throwError } from 'rxjs';


interface Conversation {
  conversationId: string;
  settings: {
    avatarUrl: string
  }
  userName: string;
  lastMessage: string;
  lastMessageAt: string
}

interface ConversationsResponse {
  message: string;
  conversations: Conversation[];
}

@Injectable({
  providedIn: 'root',
})
export class ConversationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL)
  private readonly path = `${this.apiUrl}/conversations`;
  
  readonly conversations = signal<Conversation[]>([]);
  readonly error = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);

  getConversations(): Observable<ConversationsResponse> {
    this.isLoading.set(true)
    return this.http.get<ConversationsResponse>(`${this.path}/get-user-conversations`)
    .pipe(
      tap((response) => {
        this.conversations.set(response.conversations)
        this.isLoading.set(false)
      }),
      catchError((error) => {
        this.error.set(error.error?.message || 'Произошла ошибка при получении списка бесед')
        this.isLoading.set(false)
        return throwError(() => error)
      })
    )
  }
}
