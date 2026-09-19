import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MoviesActions } from '../../ngrx/movies/movies.actions';
import {
  selectError,
  selectLoading,
  selectSelectedMovie,
} from '../../ngrx/movies/movies.selectors';

/**
 * DETAILS: read route id → dispatch loadMovie → select selectedMovie$ with async pipe.
 */
@Component({
  selector: 'app-movie-details',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly movie$ = this.store.select(selectSelectedMovie);
  readonly loading$ = this.store.select(selectLoading);
  readonly error$ = this.store.select(selectError);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.store.dispatch(MoviesActions.loadMovieFailure({ error: 'Invalid movie id' }));
      return;
    }
    this.store.dispatch(MoviesActions.loadMovie({ id }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(MoviesActions.clearSelectedMovie());
  }
}
