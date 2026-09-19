import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MovieCreate } from './movie-create';

describe('MovieCreate', () => {
  let fixture: ComponentFixture<MovieCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCreate],
      providers: [provideRouter([]), provideMockStore({ initialState: { movies: {} } })],
    }).compileComponents();
    fixture = TestBed.createComponent(MovieCreate);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
