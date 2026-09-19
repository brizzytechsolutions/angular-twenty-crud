import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MovieDetails } from './movie-details';
import { MovieAppService } from '../../services/movie-app.service';

describe('MovieDetails', () => {
  let fixture: ComponentFixture<MovieDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetails],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        {
          provide: MovieAppService,
          useValue: {
            getMovieById: () =>
              of({
                id: 1,
                title: 'Test',
                director: 'Dir',
                genre: 'Drama',
                year_of_release: 2020,
              }),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieDetails);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
