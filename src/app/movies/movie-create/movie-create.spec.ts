import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieCreate } from './movie-create';
import { MovieAppService } from '../../services/movie-app.service';
import { of } from 'rxjs';

describe('MovieCreate', () => {
  let component: MovieCreate;
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
