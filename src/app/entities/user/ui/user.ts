import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { UserAvatar } from './user-avatar/user-avatar';

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
  imports: [MatListModule, CommonModule, UserAvatar],
  templateUrl: './user.html',
  standalone: true,
  styleUrl: './user.scss',
})
export class User {
  @Input() data!: SearchUserData;
  @Output() userClick = new EventEmitter<string>();

  protected get avatarUrl(): string {
    return this.data?.settings?.avatar_url || '';
  }

  protected get userName(): string {
    return this.data?.login || '';
  }

  protected onClick(event: Event): void {
    event.stopPropagation();
    this.userClick.emit(this.data.id);
  }
}
