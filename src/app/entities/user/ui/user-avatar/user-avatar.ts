import { Component, Input } from '@angular/core';
import { GetInitialsPipe } from '@app/shared/lib/pipes/get-initials-pipe';

@Component({
  selector: 'app-user-avatar',
  imports: [GetInitialsPipe],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss',
  standalone: true,
})
export class UserAvatar {
  @Input() avatarUrl!: string;
  @Input() userName!: string;
}
