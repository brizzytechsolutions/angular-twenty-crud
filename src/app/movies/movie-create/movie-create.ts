import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { CreateMovie } from '../../types/movie';

@Component({
  selector: 'app-movie-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movie-create.html',
  styleUrl: './movie-create.scss',
})
export class MovieCreate implements OnDestroy {
  private readonly api = inject(MovieAppService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private sub?: Subscription;

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

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
    this.saving.set(true);
    this.error.set(null);

    this.sub?.unsubscribe();
    this.sub = this.api.createMovie(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.error.set('Failed to create movie');
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
