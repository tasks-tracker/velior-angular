import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_URL } from '@app/shared/config/api.config';
import { tap, catchError, throwError, finalize } from 'rxjs';

interface Message {
  id: string;
  conversationId: string;
  senderName: string;
  content: string;
  createdAt: string;
  updateAt: string;
  settings: {
    avatarUrl: string;
  };
}

interface Payload {
  conversationId: string;
  limit: number;
  offset: number;
  total: number;
}

interface MessagesResponse {
  message: string;
  data: {
    messages: Message[];
    payload: Payload;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly path = `${this.apiUrl}/messages`;

  readonly messages = signal<Message[] | null>(null);
  readonly error = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly selectedConversationId = signal<string | null>(null);

  getMessages(conversationId: string) {
    this.isLoading.set(true);
    this.selectedConversationId.set(conversationId);
    return this.http
      .get<MessagesResponse>(
        `${this.path}/get-messages-by-conversation-id?conversationId=${conversationId}`
      )
      .pipe(
        tap((response) => {
          this.isLoading.set(false);
          this.messages.set(response.data.messages.reverse());
        }),
        catchError((error) => {
          this.error.set(error.error?.message || 'Произошла ошибка при поиске пользователей');
          return throwError(() => error);
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      );
  }

  sendMessage(message: { conversationId: string; senderId: string; message: string }) {
    return this.http.post(`${this.path}/send`, message);
  }

  addNewMessageFromSocket(socketMessage: {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    settings: {
      avatar_url: string;
    };
  }) {
    if (!socketMessage) {
      return;
    }

    const formatDate = (date: Date | string): string => {
      if (date instanceof Date) {
        return date.toISOString();
      }
      return date;
    };

    const newMessage: Message = {
      id: socketMessage.id,
      conversationId: socketMessage.conversationId,
      senderName: socketMessage.senderName,
      content: socketMessage.content,
      createdAt: formatDate(socketMessage.createdAt),
      updateAt: formatDate(socketMessage.updatedAt),
      settings: {
        avatarUrl: socketMessage.settings.avatar_url,
      },
    };

    this.messages.update((prev) => {
      if (prev) {
        return [...prev, newMessage];
      }
      return [newMessage];
    });
  }
}
