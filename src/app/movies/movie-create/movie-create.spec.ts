import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MovieCreate } from './movie-create';
import { MovieAppService } from '../../services/movie-app.service';

describe('MovieCreate', () => {
  let fixture: ComponentFixture<MovieCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCreate],
      providers: [
        provideRouter([]),
        { provide: MovieAppService, useValue: { createMovie: () => of({}) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieCreate);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
