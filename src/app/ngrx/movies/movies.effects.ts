import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { MoviesActions } from './movies.actions';

/**
 * Effects listen for actions, call the API (side effects), then dispatch new actions.
 * Why Effects? Components stay thin — they only dispatch intent, not HTTP details.
 */
@Injectable()
export class MoviesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(MovieAppService);
  private readonly router = inject(Router);

  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.loadMovies),
      // switchMap cancels an in-flight request if the user reloads quickly.
      switchMap(() =>
        this.api.getMovies().pipe(
          map((movies) => MoviesActions.loadMoviesSuccess({ movies })),
          catchError(() =>
            of(MoviesActions.loadMoviesFailure({ error: 'Failed to load movies' }))
          )
        )
      )
    )
  );

  loadMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.loadMovie),
      switchMap(({ id }) =>
        this.api.getMovieById(id).pipe(
          map((movie) => MoviesActions.loadMovieSuccess({ movie })),
          catchError(() =>
            of(MoviesActions.loadMovieFailure({ error: 'Failed to load movie' }))
          )
        )
      )
    )
  );

  createMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.createMovie),
      switchMap(({ payload }) =>
        this.api.createMovie(payload).pipe(
          map((movie) => MoviesActions.createMovieSuccess({ movie })),
          catchError(() =>
            of(MoviesActions.createMovieFailure({ error: 'Failed to create movie' }))
          )
        )
      )
    )
  );

  updateMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.updateMovie),
      switchMap(({ id, payload }) =>
        this.api.updateMovie(id, payload).pipe(
          map((movie) => MoviesActions.updateMovieSuccess({ movie })),
          catchError(() =>
            of(MoviesActions.updateMovieFailure({ error: 'Failed to update movie' }))
          )
        )
      )
    )
  );

  deleteMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.deleteMovie),
      switchMap(({ id }) =>
        this.api.deleteMovie(id).pipe(
          map(() => MoviesActions.deleteMovieSuccess({ id })),
          catchError(() =>
            of(MoviesActions.deleteMovieFailure({ error: 'Failed to delete movie' }))
          )
        )
      )
    )
  );

  // Navigation is a side effect too — use dispatch:false so we don't emit another action.
  navigateHomeAfterMutation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          MoviesActions.createMovieSuccess,
          MoviesActions.updateMovieSuccess,
          MoviesActions.deleteMovieSuccess
        ),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );
}
