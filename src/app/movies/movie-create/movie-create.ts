import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CreateMovie } from '../../types/movie';
import { MoviesStore } from '../../store/movies.store';

@Component({
  selector: 'app-movie-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movie-create.html',
  styleUrl: './movie-create.scss',
})
export class MovieCreate implements OnDestroy {
  readonly store = inject(MoviesStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

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
    this.store.createMovie(payload);
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.store.clearStatus();
  }
}
