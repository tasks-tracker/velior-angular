import { Routes } from '@angular/router';
import { LoginPage } from '@pages/login/ui/login-page/login-page';
import { SignInPage } from '@pages/login/ui/sign-in-page/sign-in-page';
import { DashboardPage } from './pages/dashboard/ui/dashboard-page';
import { AuthGuard } from '@shared/lib/guards/auth';
import { LoadingPage } from './pages/loading/ui/loading-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'sign-in',
    component: SignInPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'loading',
    component: LoadingPage,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
