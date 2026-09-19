import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MoviesActions } from '../../ngrx/movies/movies.actions';
import {
  selectDeleting,
  selectError,
  selectLoading,
  selectSelectedMovie,
} from '../../ngrx/movies/movies.selectors';

/**
 * DELETE: load movie for confirmation → dispatch deleteMovie → Effect DELETEs → navigate home.
 */
@Component({
  selector: 'app-movie-delete',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './movie-delete.html',
  styleUrl: './movie-delete.scss',
})
export class MovieDelete implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  id = NaN;

  readonly movie$ = this.store.select(selectSelectedMovie);
  readonly loading$ = this.store.select(selectLoading);
  readonly deleting$ = this.store.select(selectDeleting);
  readonly error$ = this.store.select(selectError);

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(this.id)) {
      this.store.dispatch(MoviesActions.loadMovieFailure({ error: 'Invalid movie id' }));
      return;
    }
    this.store.dispatch(MoviesActions.loadMovie({ id: this.id }));
  }

  confirmDelete(): void {
    if (!Number.isFinite(this.id)) {
      return;
    }
    this.store.dispatch(MoviesActions.deleteMovie({ id: this.id }));
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.store.dispatch(MoviesActions.clearMutationStatus());
    this.store.dispatch(MoviesActions.clearSelectedMovie());
  }
}
