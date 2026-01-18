import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CutTextPipe } from '@app/shared/lib/pipes/cut-text-pipe';

// Интерфейсы для разных типов данных
export interface ConversationData {
  conversationId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
  settings: {
    avatarUrl: string;
  };
}

export interface SearchUserData {
  id: string;
  login: string;
  email?: string;
  settings: {
    avatar_url: string;
  };
  conversation_id?: string;
}

@Component({
  selector: 'app-user',
  imports: [MatListModule, CommonModule, CutTextPipe],
  templateUrl: './user.html',
  standalone: true,
  styleUrl: './user.scss',
})
export class User {
  @Input() data!: ConversationData | SearchUserData;
  @Input() mode: 'conversation' | 'search' = 'conversation';

  protected get avatarUrl(): string {
    if (this.mode === 'conversation') {
      return (this.data as ConversationData).settings.avatarUrl;
    }
    return (this.data as SearchUserData).settings.avatar_url;
  }

  protected get userName(): string {
    if (this.mode === 'conversation') {
      return (this.data as ConversationData).userName;
    }
    return (this.data as SearchUserData).login;
  }

  protected get lastMessage(): string | null {
    if (this.mode === 'conversation') {
      return (this.data as ConversationData).lastMessage || null;
    }
    return null;
  }

  protected get lastMessageAt(): string | null {
    if (this.mode === 'conversation') {
      return (this.data as ConversationData).lastMessageAt || null;
    }
    return null;
  }

  protected getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
