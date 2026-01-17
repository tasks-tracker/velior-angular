import { Component } from '@angular/core';
import { Search } from '../search/search';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

interface Conversation {
  id: number;
  name: string;
  preview: string;
  time: string;
  avatar: string;
}

@Component({
  selector: 'app-conversations',
  imports: [Search, MatListModule, CommonModule],
  templateUrl: './conversations.html',
  standalone: true,
  styleUrl: './conversations.scss',
})
export class Conversations {
  selectedConversationId: number | null = null;

  conversations: Conversation[] = [
    {
      id: 1,
      name: 'Пользователь 1',
      preview: 'Последнее сообщение...',
      time: '12:30',
      avatar: 'U'
    },
    {
      id: 2,
      name: 'Пользователь 2',
      preview: 'Другое сообщение...',
      time: '11:15',
      avatar: 'U'
    }
  ];

  selectConversation(id: number) {
    this.selectedConversationId = id;
  }
}
