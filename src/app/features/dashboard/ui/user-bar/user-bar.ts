import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User, UserService } from '@app/entities/user/model/user.service';
import { UserAvatar } from '@app/entities/user/ui/user-avatar/user-avatar';

@Component({
  selector: 'app-user-bar',
  imports: [MatIconModule, MatButtonModule, CommonModule, UserAvatar],
  templateUrl: './user-bar.html',
  styleUrl: './user-bar.scss',
  standalone: true,
})
export class UserBar {
  protected readonly userService = inject(UserService);

  protected get user() {
    return this.userService.user();
  }

  protected onSettingsClick(): void {
    console.log('Settings clicked');
  }

  protected onLogoutClick(): void {
    console.log('Logout clicked');
  }
}
