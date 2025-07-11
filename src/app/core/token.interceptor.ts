import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth); // Use inject() instead of constructor
  const token = auth.getToken();


  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq); // Note: `.handle()` is no longer needed
  }

  return next(req); // Just pass the request if no token
};
