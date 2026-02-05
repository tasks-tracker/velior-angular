import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL } from '@app/shared/config/api.config';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { UserSettings } from '@app/entities/user/model/user.service';

interface Conversation {
  conversationId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
  settings: UserSettings;
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
  private readonly apiUrl = inject(API_URL);
  private readonly path = `${this.apiUrl}/conversations`;

  readonly conversations = signal<Conversation[]>([]);
  readonly error = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);

  readonly activeTab = signal<number>(0);
  readonly targetUserId = signal<string | null>(null);

  createConversation(userId: string, partnerId: string) {
    return this.http.post(`${this.path}/create`, { user1Id: partnerId, user2Id: userId });
  }

  setActiveTab(tab: number, userId?: string) {
    this.activeTab.set(tab);
    this.targetUserId.set(userId ?? null);
  }

  getConversations(): Observable<ConversationsResponse> {
    this.isLoading.set(true);
    return this.http.get<ConversationsResponse>(`${this.path}/get-user-conversations`).pipe(
      tap((response) => {
        this.conversations.set(response.conversations);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.error.set(error.error?.message || 'Произошла ошибка при получении списка бесед');
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }
}
