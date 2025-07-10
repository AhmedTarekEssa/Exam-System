import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';


import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/token.interceptor'; // Import the function
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor]) // Register the interceptor
    ),
    // Remove the old HTTP_INTERCEPTORS provider
  ]
};
