import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CutTextPipe } from '@app/shared/lib/pipes/cut-text-pipe';
import { UserAvatar } from '@app/entities/user/ui/user-avatar/user-avatar';
import { UserSettings } from '@app/entities/user/model/user.service';

export interface ConversationData {
  conversationId: string;
  userName: string;
  lastMessage: string;
  lastMessageAt: string;
  settings: UserSettings;
}

@Component({
  selector: 'app-conversation-user',
  imports: [MatListModule, CommonModule, CutTextPipe, UserAvatar],
  templateUrl: './conversation-user.html',
  standalone: true,
  styleUrl: './conversation-user.scss',
})
export class ConversationUser {
  @Input() data!: ConversationData;
  @Input() isActive = false;
  @Output() userClick = new EventEmitter<string>();
  @Output() conversationUser = new EventEmitter<ConversationData>();

  protected get avatarUrl(): string {
    const settings = this.data.settings as { avatarUrl?: string; avatar_url?: string };
    return settings.avatarUrl || settings.avatar_url || '';
  }

  protected onClick(event: Event): void {
    event.stopPropagation();
    this.conversationUser.emit(this.data);
    this.userClick.emit(this.data.conversationId);
  }
}
