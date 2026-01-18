import { InjectionToken } from '@angular/core';

/**
 * InjectionToken для базового URL API
 * Используется для переиспользования API URL по всему приложению
 */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => {
    // Можно использовать environment переменные или другие источники
    // Для продакшена можно читать из переменных окружения
    return process.env['API_URL'] || 'http://localhost:8000';
  },
});
