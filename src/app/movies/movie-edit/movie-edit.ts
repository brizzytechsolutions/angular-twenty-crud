import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { UpdateMovie } from '../../types/movie';
import { MoviesActions } from '../../ngrx/movies/movies.actions';
import {
  selectError,
  selectLoading,
  selectSaving,
  selectSelectedMovie,
} from '../../ngrx/movies/movies.selectors';

/**
 * EDIT: load movie into store → patch form once from selectedMovie$ → dispatch updateMovie.
 * We use take(1) so we only patch when the movie first arrives (no signals/effects).
 */
@Component({
  selector: 'app-movie-edit',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './movie-edit.html',
  styleUrl: './movie-edit.scss',
})
export class MovieEdit implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  id = NaN;

  readonly movie$ = this.store.select(selectSelectedMovie);
  readonly loading$ = this.store.select(selectLoading);
  readonly saving$ = this.store.select(selectSaving);
  readonly error$ = this.store.select(selectError);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    director: ['', [Validators.required, Validators.minLength(2)]],
    genre: ['', [Validators.required, Validators.minLength(2)]],
    year_of_release: [new Date().getFullYear(), [Validators.required, Validators.min(1888)]],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(this.id)) {
      this.store.dispatch(MoviesActions.loadMovieFailure({ error: 'Invalid movie id' }));
      return;
    }

    this.store.dispatch(MoviesActions.loadMovie({ id: this.id }));

    this.movie$
      .pipe(
        filter((movie) => !!movie),
        take(1)
      )
      .subscribe((movie) => {
        this.form.patchValue({
          title: movie!.title,
          director: movie!.director,
          genre: movie!.genre,
          year_of_release: movie!.year_of_release,
        });
      });
  }

  save(): void {
    if (!Number.isFinite(this.id) || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: UpdateMovie = this.form.getRawValue();
    this.store.dispatch(MoviesActions.updateMovie({ id: this.id, payload }));
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.store.dispatch(MoviesActions.clearMutationStatus());
    this.store.dispatch(MoviesActions.clearSelectedMovie());
  }
}
