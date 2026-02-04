import { Component } from '@angular/core';
import { SignInForm } from '@features/auth/login/ui/sign-in-form/sign-in-form';

@Component({
  selector: 'app-sign-in-page',
  imports: [SignInForm],
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.scss',
})
export class SignInPage {}
