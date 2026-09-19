import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MovieList } from './movie-list';
import { MovieAppService } from '../../services/movie-app.service';
import { of } from 'rxjs';

describe('MovieList', () => {
  let fixture: ComponentFixture<MovieList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: MovieAppService, useValue: { getMovies: () => of([]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieList);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
