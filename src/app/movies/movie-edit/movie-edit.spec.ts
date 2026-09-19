import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MovieEdit } from './movie-edit';
import { MovieAppService } from '../../services/movie-app.service';

describe('MovieEdit', () => {
  let fixture: ComponentFixture<MovieEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieEdit],
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
            updateMovie: () => of({}),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieEdit);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
