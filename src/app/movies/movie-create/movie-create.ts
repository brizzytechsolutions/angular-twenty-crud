import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CreateMovie } from '../../types/movie';
import { MoviesActions } from '../../ngrx/movies/movies.actions';
import { selectError, selectSaving } from '../../ngrx/movies/movies.selectors';

/**
 * CREATE: validate form → dispatch createMovie → Effect POSTs → success Effect navigates home.
 */
@Component({
  selector: 'app-movie-create',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './movie-create.html',
  styleUrl: './movie-create.scss',
})
export class MovieCreate implements OnDestroy {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly saving$ = this.store.select(selectSaving);
  readonly error$ = this.store.select(selectError);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    director: ['', [Validators.required, Validators.minLength(2)]],
    genre: ['', [Validators.required, Validators.minLength(2)]],
    year_of_release: [new Date().getFullYear(), [Validators.required, Validators.min(1888)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: CreateMovie = this.form.getRawValue();
    this.store.dispatch(MoviesActions.createMovie({ payload }));
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    // Clear sticky error/saving flags when leaving the screen.
    this.store.dispatch(MoviesActions.clearMutationStatus());
  }
}
