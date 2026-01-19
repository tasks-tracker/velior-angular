import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../model/chat.service';
import { UserService } from '@app/entities/user/model/user.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chat.html',
  standalone: true,
  styleUrl: './chat.scss',
})
export class Chat {
  protected readonly chatService = inject(ChatService);
  protected readonly userService = inject(UserService);

  messageValue = signal<string>('');

  protected get messages() {
    return this.chatService.messages();
  }

  protected setMessageValue(value: string) {
    this.messageValue.set(value);
  }

  protected handleSendMessage() {
    const message = this.messageValue();

    if (message.trim() === '') return;

    this.chatService
      .sendMessage({
        conversationId: this.chatService.selectedConversationId() || '',
        senderId: this.userService.user()?.id || '',
        message: message,
      })
      .subscribe();

    this.messageValue.set('');
  }

  protected get currentUserLogin(): string | null {
    return this.userService.user()?.login || null;
  }

  protected isMyMessage(senderName: string): boolean {
    const currentUser = this.currentUserLogin;
    if (!currentUser) return false;
    return senderName.toLowerCase() === currentUser.toLowerCase();
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
