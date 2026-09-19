import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MoviesActions } from '../../ngrx/movies/movies.actions';
import {
  selectError,
  selectLoading,
  selectMovies,
} from '../../ngrx/movies/movies.selectors';

/**
 * LIST with NgRx:
 * dispatch load → Effect calls API → reducer updates store → select Observables → async pipe.
 * No signals here on purpose — we use RxJS Observables + async pipe.
 */
@Component({
  selector: 'app-movie-list',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit {
  private readonly store = inject(Store);

  readonly movies$ = this.store.select(selectMovies);
  readonly loading$ = this.store.select(selectLoading);
  readonly error$ = this.store.select(selectError);

  ngOnInit(): void {
    this.store.dispatch(MoviesActions.loadMovies());
  }

  reload(): void {
    this.store.dispatch(MoviesActions.loadMovies());
  }
}
