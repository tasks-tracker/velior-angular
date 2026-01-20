import { InjectionToken } from '@angular/core';

/**
 * InjectionToken для базового URL API
 * Используется для переиспользования API URL по всему приложению
 */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => {
    return process?.env?.['API_URL'] || 'http://localhost:8000';
  },
});

export const WS_URL = new InjectionToken<string>('WS_URL', {
  providedIn: 'root',
  factory: () => {
    return 'http://localhost:8000';
  },
});
