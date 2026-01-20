import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../model/chat.service';
import { UserService } from '@app/entities/user/model/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SocketService } from '../../model/socket.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy {
  protected readonly chatService = inject(ChatService);
  protected readonly userService = inject(UserService);
  private readonly socketService = inject(SocketService);
  private subscriptions = new Subscription();

  messageValue = signal<string>('');

  ngOnInit(): void {
    this.socketService.connect();
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    const joinedSubscription = this.socketService.onConversationJoined().subscribe((data) => {
      console.log('Conversation joined:', data.conversationId);
    });
    this.subscriptions.add(joinedSubscription);

    const messageSubscription = this.socketService.onNewMessage().subscribe((data) => {
      this.chatService.addNewMessageFromSocket(data.data.message);
    });
    this.subscriptions.add(messageSubscription);
  }

  ngOnDestroy(): void {
    if (this.chatService.selectedConversationId()) {
      this.socketService.leaveConversation(this.chatService.selectedConversationId()!);
    }
    this.subscriptions.unsubscribe();
    this.socketService.disconnect();
  }

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

    this.socketService.sendMessage({
      conversationId: this.chatService.selectedConversationId() || '',
      message: message,
    });

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
