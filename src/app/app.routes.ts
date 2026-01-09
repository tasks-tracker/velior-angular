import { Routes } from '@angular/router';
import { LoginPage } from '@pages/login/ui/login-page/login-page';
import { SignInPage } from '@pages/login/ui/sign-in-page/sign-in-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'sign-in',
    component: SignInPage,
  },
];
