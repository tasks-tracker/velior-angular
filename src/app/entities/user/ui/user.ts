import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CutTextPipe } from '@app/shared/lib/pipes/cut-text-pipe';
import { UserAvatar } from './user-avatar/user-avatar';

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
  imports: [MatListModule, CommonModule, CutTextPipe, UserAvatar],
  templateUrl: './user.html',
  standalone: true,
  styleUrl: './user.scss',
})
export class User {
  @Output() userClick = new EventEmitter<string>();
  @Input() data!: ConversationData | SearchUserData;
  @Input() mode: 'conversation' | 'search' = 'conversation';
  @Input() isActive: boolean = false;
  @Output() conversationUser = new EventEmitter<ConversationData>();

  protected get avatarUrl(): string {
    if (this.mode === 'conversation') {
      return (this.data as ConversationData).settings.avatarUrl || '';
    }
    return (this.data as SearchUserData)?.settings?.avatar_url || '';
  }

  protected get userName(): string {
    if (this.mode === 'conversation') {
      return (this.data as ConversationData).userName;
    }
    console.log(this.data);
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

  protected onClick(event: Event): void {
    event.stopPropagation();

    if (this.mode === 'conversation') {
      const conversationId = (this.data as ConversationData).conversationId;
      this.conversationUser.emit(this.data as ConversationData);
      this.userClick.emit(conversationId);
    } else {
      const userId = (this.data as SearchUserData).id;
      this.userClick.emit(userId);
    }
  }
}
