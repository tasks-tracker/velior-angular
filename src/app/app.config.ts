import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { API_URL } from '@shared/config/api.config';
import { authInterceptor } from '@app/shared/lib/interceptors/auth.interceptor';
import { UserService } from '@app/entities/user/model/user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: API_URL,
      useValue: 'http://localhost:8000',
    },
    provideAppInitializer(() => {
      const userService = inject(UserService);

      userService.me();
    }),
  ],
};
