import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { AppConfigService } from './services/app-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    // Load runtime API URL before the app starts handling routes.
    provideAppInitializer(() => {
      const cfg = inject(AppConfigService);
      return cfg.load();
    }),
  ],
};
