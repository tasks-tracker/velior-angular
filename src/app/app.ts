import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '@app/entities/user/model/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('velior-angular');
  protected readonly userService = inject(UserService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const error = this.userService.error();
      if (error) {
        this.router.navigate(['/login']);
      }

      const user = this.userService.user();
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnInit(): void {
    this.userService.me();
  }
}
