import { createFeature, createReducer, on } from '@ngrx/store';
import { Movie } from '../../types/movie';
import { MoviesActions } from './movies.actions';

export type MoviesState = {
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
 * Reducer is a pure function: (state, action) => newState.
 * We never call HTTP here — only update in-memory state.
 */
const moviesReducer = createReducer(
  initialState,
  on(MoviesActions.loadMovies, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MoviesActions.loadMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies,
    loading: false,
  })),
  on(MoviesActions.loadMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(MoviesActions.loadMovie, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedMovie: null,
  })),
  on(MoviesActions.loadMovieSuccess, (state, { movie }) => ({
    ...state,
    selectedMovie: movie,
    loading: false,
  })),
  on(MoviesActions.loadMovieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MoviesActions.clearSelectedMovie, (state) => ({
    ...state,
    selectedMovie: null,
  })),

  on(MoviesActions.createMovie, MoviesActions.updateMovie, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(MoviesActions.createMovieSuccess, (state, { movie }) => ({
    ...state,
    saving: false,
    movies: [...state.movies, movie],
  })),
  on(MoviesActions.updateMovieSuccess, (state, { movie }) => ({
    ...state,
    saving: false,
    movies: state.movies.map((m) => (m.id === movie.id ? movie : m)),
    selectedMovie: movie,
  })),
  on(MoviesActions.createMovieFailure, MoviesActions.updateMovieFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(MoviesActions.deleteMovie, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(MoviesActions.deleteMovieSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    movies: state.movies.filter((m) => m.id !== id),
    selectedMovie: null,
  })),
  on(MoviesActions.deleteMovieFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  on(MoviesActions.clearMutationStatus, (state) => ({
    ...state,
    saving: false,
    deleting: false,
    error: null,
  }))
);

export const moviesFeature = createFeature({
  name: 'movies',
  reducer: moviesReducer,
});
