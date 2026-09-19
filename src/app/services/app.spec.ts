import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AppConfigService],
    });
    service = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should expose apiBaseUrl as a computed signal', async () => {
    const promise = service.load();
    const req = httpMock.expectOne('/assets/app-config.json');
    req.flush({ apiBaseUrl: 'http://localhost:3000/api' });
    await promise;
    expect(service.apiBaseUrl()).toBe('http://localhost:3000/api');
  });
});
