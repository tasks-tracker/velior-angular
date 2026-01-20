import { inject, Injectable } from '@angular/core';
import { WS_URL } from '@app/shared/config/api.config';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface JoinConversation {
  conversationId: string;
}

export interface MessagePayload {
  message: string;
  data: {
    message: {
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
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private readonly wsUrl = inject(WS_URL);
  private readonly chatUrl = `${this.wsUrl}/chat`;
  private conversationJoinedSubject = new Subject<{ conversationId: string }>();
  private newMessageSubject = new Subject<MessagePayload>();
  private conversationLeftSubject = new Subject<{ conversationId: string }>();

  /**
   * Подключение к WebSocket
   * @param sessionId - ID сессии пользователя
   */
  connect() {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(this.chatUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server:', this.socket?.id);
      this.setupEventListeners();
    });

    if (this.socket.connected) {
      this.setupEventListeners();
    }
  }

  /**
   * Публикация сообщения в беседу
   */
  sendMessage(payload: Record<string, any>) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('message:send', payload);
  }

  /**
   * Отключение от WebSocket
   */
  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Присоединиться к беседе
   */
  joinConversation(conversationId: string) {
    if (!this.socket?.connected) {
      console.log('Not connected to WebSocket server');
      return;
    }

    this.socket.emit('conversation:join', { conversationId });
  }

  /**
   * Покинуть беседу
   */
  leaveConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('conversation:leave', { conversationId });
  }

  /**
   * Настройка обработчиков событий сокета (вызывается один раз)
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Удаляем старые обработчики перед добавлением новых
    this.socket.off('conversation:joined');
    this.socket.off('conversation:left');
    this.socket.off('message:new');

    this.socket.on('conversation:joined', (data: { conversationId: string }) => {
      this.conversationJoinedSubject.next(data);
    });

    this.socket.on('conversation:left', (data: { conversationId: string }) => {
      this.conversationLeftSubject.next(data);
    });

    this.socket.on('message:new', (data: MessagePayload) => {
      this.newMessageSubject.next(data);
    });
  }

  /**
   * Слушать событие успешного присоединения к беседе
   */
  onConversationJoined(): Observable<{ conversationId: string }> {
    return this.conversationJoinedSubject.asObservable();
  }

  /**
   * Слушать событие выхода из беседы
   */
  onConversationLeft(): Observable<{ conversationId: string }> {
    return this.conversationLeftSubject.asObservable();
  }

  /**
   * Слушать событие нового сообщения
   */
  onNewMessage(): Observable<MessagePayload> {
    return this.newMessageSubject.asObservable();
  }

  /**
   * Проверить, подключен ли WebSocket
   */

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
