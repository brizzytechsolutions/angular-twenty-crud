import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

type AppRuntimeConfig = {
  apiBaseUrl: string;
};

/**
 * Loads /assets/app-config.json once at startup.
 * We use a plain property (not a signal) so beginners can see classic DI + RxJS.
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private config: AppRuntimeConfig | null = null;

  async load(): Promise<void> {
    this.config = await firstValueFrom(
      this.http.get<AppRuntimeConfig>('/assets/app-config.json')
    );
  }

  apiBaseUrl(): string {
    if (!this.config?.apiBaseUrl) {
      throw new Error('API base URL is not configured');
    }
    return this.config.apiBaseUrl;
  }
}
