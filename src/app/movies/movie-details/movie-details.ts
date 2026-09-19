import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { Movie } from '../../types/movie';

/**
 * DETAILS (Read one)
 * Flow: read :id from ActivatedRoute -> getMovieById(id) -> subscribe -> show movie.
 */
@Component({
  selector: 'app-movie-details',
  imports: [RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(MovieAppService);
  private sub?: Subscription;

  movie: Movie | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.error = 'Invalid movie id';
      return;
    }

    this.loading = true;
    this.sub = this.api.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load movie';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
