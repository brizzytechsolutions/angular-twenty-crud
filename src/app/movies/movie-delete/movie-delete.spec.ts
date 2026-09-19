import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MovieDelete } from './movie-delete';
import { MovieAppService } from '../../services/movie-app.service';

describe('MovieDelete', () => {
  let fixture: ComponentFixture<MovieDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDelete],
      providers: [
        provideRouter([]),
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
            deleteMovie: () => of(void 0),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieDelete);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
