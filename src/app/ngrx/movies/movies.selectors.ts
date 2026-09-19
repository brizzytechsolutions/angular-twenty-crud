import { moviesFeature } from './movies.reducer';

/**
 * Selectors read slices of the store for templates (via async pipe).
 * createFeature already generates these from state keys.
 */
export const {
  selectMovies,
  selectSelectedMovie,
  selectLoading,
  selectSaving,
  selectDeleting,
  selectError,
} = moviesFeature;
