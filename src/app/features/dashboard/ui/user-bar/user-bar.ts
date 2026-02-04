import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserService } from '@app/entities/user/model/user.service';
import { UserAvatar } from '@app/entities/user/ui/user-avatar/user-avatar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-bar',
  imports: [MatIconModule, MatButtonModule, CommonModule, UserAvatar],
  templateUrl: './user-bar.html',
  styleUrl: './user-bar.scss',
  standalone: true,
})
export class UserBar {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected get user() {
    return this.userService.user();
  }

  protected onSettings(): void {
    this.router.navigate(['/settings']);
  }

  protected onLogout(): void {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
