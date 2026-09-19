import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateMovie, Movie, UpdateMovie } from '../../types/movie';

/**
 * Actions describe "what happened" in the UI/API lifecycle.
 * Components dispatch these; Effects/reducers react to them.
 */
export const MoviesActions = createActionGroup({
  source: 'Movies',
  events: {
    'Load Movies': emptyProps(),
    'Load Movies Success': props<{ movies: Movie[] }>(),
    'Load Movies Failure': props<{ error: string }>(),

    'Load Movie': props<{ id: number }>(),
    'Load Movie Success': props<{ movie: Movie }>(),
    'Load Movie Failure': props<{ error: string }>(),
    'Clear Selected Movie': emptyProps(),

    'Create Movie': props<{ payload: CreateMovie }>(),
    'Create Movie Success': props<{ movie: Movie }>(),
    'Create Movie Failure': props<{ error: string }>(),

    'Update Movie': props<{ id: number; payload: UpdateMovie }>(),
    'Update Movie Success': props<{ movie: Movie }>(),
    'Update Movie Failure': props<{ error: string }>(),

    'Delete Movie': props<{ id: number }>(),
    'Delete Movie Success': props<{ id: number }>(),
    'Delete Movie Failure': props<{ error: string }>(),

    'Clear Mutation Status': emptyProps(),
  },
});
