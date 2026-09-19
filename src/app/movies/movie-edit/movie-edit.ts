import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { UpdateMovie } from '../../types/movie';

/**
 * UPDATE
 * Flow: load movie by id -> patchValue into form -> on save PUT via service -> navigate home.
 */
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

  id = NaN;
  loading = false;
  saving = false;
  loadError: string | null = null;
  saveError: string | null = null;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    director: ['', [Validators.required, Validators.minLength(2)]],
    genre: ['', [Validators.required, Validators.minLength(2)]],
    year_of_release: [new Date().getFullYear(), [Validators.required, Validators.min(1888)]],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(this.id)) {
      this.loadError = 'Invalid movie id';
      return;
    }

    this.loading = true;
    this.loadSub = this.api.getMovieById(this.id).subscribe({
      next: (movie) => {
        this.form.patchValue({
          title: movie.title,
          director: movie.director,
          genre: movie.genre,
          year_of_release: movie.year_of_release,
        });
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Failed to load movie';
        this.loading = false;
      },
    });
  }

  save(): void {
    if (!Number.isFinite(this.id) || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UpdateMovie = this.form.getRawValue();
    this.saving = true;
    this.saveError = null;

    this.saveSub?.unsubscribe();
    this.saveSub = this.api.updateMovie(this.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.saveError = 'Failed to update movie';
        this.saving = false;
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
