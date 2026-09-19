import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MovieList } from './movie-list';
import { MovieAppService } from '../../services/movie-app.service';

describe('MovieList', () => {
  let fixture: ComponentFixture<MovieList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieList],
      providers: [
        provideRouter([]),
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
