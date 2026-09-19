import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { MovieAppService } from '../services/movie-app.service';
import { CreateMovie, Movie, UpdateMovie } from '../types/movie';

type MoviesState = {
  movies: Movie[];
  selectedMovie: Movie | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
};

const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};

/**
 * NgRx SignalStore = single source of truth using signals (not classic actions/reducers).
 * - withState: reactive state signals (movies(), loading(), ...)
 * - rxMethod: bridges Observables (HttpClient) into the store
 * - patchState: immutable updates, like a tiny reducer
 */
export const MoviesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(MovieAppService), router = inject(Router)) => ({
    loadMovies: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getMovies().pipe(
            tapResponse({
              next: (movies) => patchState(store, { movies, loading: false }),
              error: () =>
                patchState(store, { loading: false, error: 'Failed to load movies' }),
            })
          )
        )
      )
    ),

    loadMovie: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, selectedMovie: null })),
        switchMap((id) =>
          api.getMovieById(id).pipe(
            tapResponse({
              next: (movie) => patchState(store, { selectedMovie: movie, loading: false }),
              error: () =>
                patchState(store, { loading: false, error: 'Failed to load movie' }),
            })
          )
        )
      )
    ),

    createMovie: rxMethod<CreateMovie>(
      pipe(
        tap(() => patchState(store, { saving: true, error: null })),
        switchMap((payload) =>
          api.createMovie(payload).pipe(
            tapResponse({
              next: (movie) => {
                patchState(store, {
                  saving: false,
                  movies: [...store.movies(), movie],
                });
                router.navigate(['/home']);
              },
              error: () =>
                patchState(store, { saving: false, error: 'Failed to create movie' }),
            })
          )
        )
      )
    ),

    updateMovie: rxMethod<{ id: number; payload: UpdateMovie }>(
      pipe(
        tap(() => patchState(store, { saving: true, error: null })),
        switchMap(({ id, payload }) =>
          api.updateMovie(id, payload).pipe(
            tapResponse({
              next: (movie) => {
                patchState(store, {
                  saving: false,
                  selectedMovie: movie,
                  movies: store.movies().map((m) => (m.id === movie.id ? movie : m)),
                });
                router.navigate(['/home']);
              },
              error: () =>
                patchState(store, { saving: false, error: 'Failed to update movie' }),
            })
          )
        )
      )
    ),

    deleteMovie: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { deleting: true, error: null })),
        switchMap((id) =>
          api.deleteMovie(id).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  deleting: false,
                  selectedMovie: null,
                  movies: store.movies().filter((m) => m.id !== id),
                });
                router.navigate(['/home']);
              },
              error: () =>
                patchState(store, { deleting: false, error: 'Failed to delete movie' }),
            })
          )
        )
      )
    ),

    clearSelectedMovie(): void {
      patchState(store, { selectedMovie: null });
    },

    clearStatus(): void {
      patchState(store, { saving: false, deleting: false, error: null });
    },

    setError(error: string): void {
      patchState(store, { error, loading: false });
    },
  }))
);
