import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MovieEdit } from './movie-edit';

describe('MovieEdit', () => {
  let fixture: ComponentFixture<MovieEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieEdit],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState: { movies: { selectedMovie: null } } }),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieEdit);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
