import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { Movie } from '../../types/movie';

/**
 * LIST with Signals:
 * HTTP Observable → subscribe → signal.set() → template reads movies() / loading().
 * Signals give fine-grained UI updates without NgRx.
 */
@Component({
  selector: 'app-movie-list',
  imports: [RouterLink],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit, OnDestroy {
  private readonly api = inject(MovieAppService);
  private sub?: Subscription;

  readonly movies = signal<Movie[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMovies();
  }

  reload(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    this.loading.set(true);
    this.error.set(null);
    this.sub?.unsubscribe();
    this.sub = this.api.getMovies().subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load movies');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
