import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { CreateMovie } from '../../types/movie';

/**
 * CREATE
 * Flow: reactive form validate -> service.createMovie() -> subscribe -> navigate to list.
 * Why ReactiveForms? Built-in validators and easy getRawValue() for the POST body.
 */
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

  saving = false;
  error: string | null = null;

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
    this.saving = true;
    this.error = null;

    this.sub?.unsubscribe();
    this.sub = this.api.createMovie(payload).subscribe({
      next: () => {
        this.saving = false;
        // After create, go back to the list so the user sees the new row after reload.
        this.router.navigate(['/home']);
      },
      error: () => {
        this.error = 'Failed to create movie';
        this.saving = false;
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
