import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieList } from './movie-list';
import { MovieAppService } from '../../services/movie-app.service';
import { of } from 'rxjs';

describe('MovieList', () => {
  let component: MovieList;
  let fixture: ComponentFixture<MovieList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieList],
      providers: [
        provideRouter([]),
        {
          provide: MovieAppService,
          useValue: { getMovies: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
