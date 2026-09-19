import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieAppService } from '../../services/movie-app.service';
import { Movie } from '../../types/movie';

/**
 * DELETE
 * Flow: load movie for confirmation UI -> confirmDelete() -> service.deleteMovie() -> navigate home.
 */
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

  id = NaN;
  movie: Movie | null = null;
  loading = false;
  deleting = false;
  loadError: string | null = null;
  deleteError: string | null = null;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(this.id)) {
      this.loadError = 'Invalid movie id';
      return;
    }

    this.loading = true;
    this.loadSub = this.api.getMovieById(this.id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: () => {
        this.loadError = 'Failed to load movie';
        this.loading = false;
      },
    });
  }

  confirmDelete(): void {
    if (!Number.isFinite(this.id)) {
      return;
    }

    this.deleting = true;
    this.deleteError = null;
    this.deleteSub?.unsubscribe();
    this.deleteSub = this.api.deleteMovie(this.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.deleteError = 'Failed to delete movie';
        this.deleting = false;
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
