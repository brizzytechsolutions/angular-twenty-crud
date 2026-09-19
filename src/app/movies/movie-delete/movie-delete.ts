import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { Movie } from '../../types/movie';

@Component({
  selector: 'app-movie-delete',
  imports: [RouterLink],
  templateUrl: './movie-delete.html',
  styleUrl: './movie-delete.scss',
})
export class MovieDelete implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(MovieAppService);
  private loadSub?: Subscription;
  private deleteSub?: Subscription;

  readonly id = signal(NaN);
  readonly movie = signal<Movie | null>(null);
  readonly loading = signal(false);
  readonly deleting = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly deleteError = signal<string | null>(null);

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
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Failed to load movie');
        this.loading.set(false);
      },
    });
  }

  confirmDelete(): void {
    const movieId = this.id();
    if (!Number.isFinite(movieId)) {
      return;
    }

    this.deleting.set(true);
    this.deleteError.set(null);
    this.deleteSub?.unsubscribe();
    this.deleteSub = this.api.deleteMovie(movieId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.deleteError.set('Failed to delete movie');
        this.deleting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.loadSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }
}
