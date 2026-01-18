import { Component } from '@angular/core';
import { Conversations } from '../conversations/conversations';
import { Chat } from '../chat/chat';

@Component({
  selector: 'app-dashboard',
  imports: [Conversations, Chat],
  templateUrl: './dashboard.html',
  standalone: true,
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
