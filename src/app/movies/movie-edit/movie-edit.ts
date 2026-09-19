import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UpdateMovie } from '../../types/movie';
import { MoviesStore } from '../../store/movies.store';

/**
 * EDIT: loadMovie into store → effect() watches selectedMovie() once → patch form → updateMovie.
 * effect() is chosen here because it reacts to signal changes cleanly (no manual subscribe).
 */
@Component({
  selector: 'app-movie-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movie-edit.html',
  styleUrl: './movie-edit.scss',
})
export class MovieEdit implements OnInit, OnDestroy {
  readonly store = inject(MoviesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly id = signal(NaN);
  private patched = false;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    director: ['', [Validators.required, Validators.minLength(2)]],
    genre: ['', [Validators.required, Validators.minLength(2)]],
    year_of_release: [new Date().getFullYear(), [Validators.required, Validators.min(1888)]],
  });

  constructor() {
    effect(() => {
      const movie = this.store.selectedMovie();
      if (!movie || this.patched) {
        return;
      }
      this.form.patchValue({
        title: movie.title,
        director: movie.director,
        genre: movie.genre,
        year_of_release: movie.year_of_release,
      });
      this.patched = true;
    });
  }

  ngOnInit(): void {
    const routeId = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(routeId);
    if (!Number.isFinite(routeId)) {
      this.store.setError('Invalid movie id');
      return;
    }
    this.patched = false;
    this.store.loadMovie(routeId);
  }

  save(): void {
    const movieId = this.id();
    if (!Number.isFinite(movieId) || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: UpdateMovie = this.form.getRawValue();
    this.store.updateMovie({ id: movieId, payload });
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.store.clearStatus();
    this.store.clearSelectedMovie();
  }
}
