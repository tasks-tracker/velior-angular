import { Component, inject, OnInit } from '@angular/core';
import { Search } from '../search/search';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { ConversationsService } from '../../model/conversations.service';
import { User } from '@app/entities/user/ui/user';

@Component({
  selector: 'app-conversations',
  imports: [Search, MatListModule, User, MatTabsModule, CommonModule],
  templateUrl: './conversations.html',
  standalone: true,
  styleUrl: './conversations.scss',
})
export class Conversations implements OnInit {
  protected readonly conversationsService = inject(ConversationsService);

  ngOnInit(): void {
    this.conversationsService.getConversations().subscribe();
  }

  protected get conversations() {
    return this.conversationsService.conversations();
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
