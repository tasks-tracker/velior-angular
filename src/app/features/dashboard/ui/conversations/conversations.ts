import { Component, inject, OnInit } from '@angular/core';
import { Search } from '../search/search';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { ConversationsService } from '../../model/conversations.service';
import { ConversationData, User } from '@app/entities/user/ui/user';
import { ChatService } from '../../model/chat.service';
import { SocketService } from '../../model/socket.service';

@Component({
  selector: 'app-conversations',
  imports: [Search, MatListModule, User, MatTabsModule, CommonModule],
  templateUrl: './conversations.html',
  standalone: true,
  styleUrl: './conversations.scss',
})
export class Conversations implements OnInit {
  protected readonly conversationsService = inject(ConversationsService);
  protected readonly chatService = inject(ChatService);
  private readonly socketService = inject(SocketService);

  ngOnInit(): void {
    this.conversationsService.getConversations().subscribe();
  }

  getMessages(event: string) {
    this.chatService.getMessages(event).subscribe({
      next: () => {
        if (this.socketService.isConnected()) {
          this.socketService.joinConversation(event);
        }
      },
    });
  }

  setConversationUser(event: ConversationData) {
    this.chatService.conversationUser.set(event);
  }

  protected get conversations() {
    return this.conversationsService.conversations();
  }

  protected isActive(conversationId: string): boolean {
    const selectedId = this.chatService.selectedConversationId();
    return selectedId === conversationId;
  }

  protected get isLoading() {
    return this.conversationsService.isLoading();
  }

  protected get error() {
    return this.conversationsService.error();
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
