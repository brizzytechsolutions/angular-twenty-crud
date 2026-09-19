import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { Movie } from '../../types/movie';

/**
 * LIST (Read many)
 * Flow: ngOnInit -> service.getMovies() -> subscribe -> assign plain properties -> template re-renders.
 * We keep a Subscription and unsubscribe in ngOnDestroy to avoid memory leaks.
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

  movies: Movie[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadMovies();
  }

  reload(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    this.loading = true;
    this.error = null;

    // Cancel any in-flight request before starting a new one.
    this.sub?.unsubscribe();
    this.sub = this.api.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load movies';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
