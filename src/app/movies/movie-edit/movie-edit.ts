import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { UpdateMovie } from '../../types/movie';

@Component({
  selector: 'app-movie-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movie-edit.html',
  styleUrl: './movie-edit.scss',
})
export class MovieEdit implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(MovieAppService);
  private readonly fb = inject(FormBuilder);
  private loadSub?: Subscription;
  private saveSub?: Subscription;

  readonly id = signal(NaN);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    director: ['', [Validators.required, Validators.minLength(2)]],
    genre: ['', [Validators.required, Validators.minLength(2)]],
    year_of_release: [new Date().getFullYear(), [Validators.required, Validators.min(1888)]],
  });

  ngOnInit(): void {
    const routeId = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(routeId);
    if (!Number.isFinite(routeId)) {
      this.loadError.set('Invalid movie id');
      return;
    }

    this.loading.set(true);
    this.loadSub = this.api.getMovieById(routeId).subscribe({
      next: (movie) => {
        this.form.patchValue({
          title: movie.title,
          director: movie.director,
          genre: movie.genre,
          year_of_release: movie.year_of_release,
        });
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Failed to load movie');
        this.loading.set(false);
      },
    });
  }

  save(): void {
    const movieId = this.id();
    if (!Number.isFinite(movieId) || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UpdateMovie = this.form.getRawValue();
    this.saving.set(true);
    this.saveError.set(null);

    this.saveSub?.unsubscribe();
    this.saveSub = this.api.updateMovie(movieId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.saveError.set('Failed to update movie');
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.loadSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}
