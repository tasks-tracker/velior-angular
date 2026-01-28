import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor для добавления credentials (cookies/tokens) к каждому HTTP запросу
 * Это необходимо для отправки session cookies, установленных бэкендом
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: true,
  });

  return next(clonedRequest);
};
