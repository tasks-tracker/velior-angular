import { Routes } from '@angular/router';
import { LoginPage } from '@pages/login/ui/login-page/login-page';
import { SignInPage } from '@pages/login/ui/sign-in-page/sign-in-page';
import { DashboardPage } from './pages/dashboard/ui/dashboard-page/dashboard-page';

export const routes: Routes = [
  {
    path: '**',
    redirectTo: 'dashboard',
  },
  {
    path: 'sign-in',
    component: SignInPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
