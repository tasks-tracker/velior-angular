import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '@app/entities/user/model/user.service';

/**
 * Guard для защиты маршрутов, требующих авторизации
 * Редиректит на /login если пользователь не авторизован
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const user = this.userService.user();
    const isLoading = this.userService.isLoading();

    if (!user && !isLoading) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
