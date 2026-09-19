import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

type AppRuntimeConfig = {
  apiBaseUrl: string;
};

/**
 * Config as a signal so dependents can react if we ever reload config.
 * computed() derives apiBaseUrl safely for templates/services.
 */
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private readonly config = signal<AppRuntimeConfig | null>(null);

  readonly apiBaseUrl = computed(() => {
    const value = this.config()?.apiBaseUrl;
    if (!value) {
      throw new Error('API base URL is not configured');
    }
    return value;
  });

  async load(): Promise<void> {
    const data = await firstValueFrom(
      this.http.get<AppRuntimeConfig>('/assets/app-config.json')
    );
    this.config.set(data);
  }
}
