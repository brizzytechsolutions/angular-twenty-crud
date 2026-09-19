import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MovieDelete } from './movie-delete';

describe('MovieDelete', () => {
  let fixture: ComponentFixture<MovieDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDelete],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState: { movies: {} } }),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieDelete);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
