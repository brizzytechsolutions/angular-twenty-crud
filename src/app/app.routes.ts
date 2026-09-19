import { Routes } from '@angular/router';

/**
 * Lazy-loaded routes keep the initial bundle small.
 * Each movie screen is loaded only when the user navigates to it.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./movies/movie-list/movie-list').then((m) => m.MovieList),
  },
  {
    path: 'home/create',
    loadComponent: () =>
      import('./movies/movie-create/movie-create').then((m) => m.MovieCreate),
  },
  {
    path: 'home/:id',
    loadComponent: () =>
      import('./movies/movie-details/movie-details').then((m) => m.MovieDetails),
  },
  {
    path: 'home/:id/edit',
    loadComponent: () =>
      import('./movies/movie-edit/movie-edit').then((m) => m.MovieEdit),
  },
  {
    path: 'home/:id/delete',
    loadComponent: () =>
      import('./movies/movie-delete/movie-delete').then((m) => m.MovieDelete),
  },
  { path: '**', redirectTo: 'home' },
];
