import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesStore } from '../../store/movies.store';

@Component({
  selector: 'app-movie-delete',
  imports: [RouterLink],
  templateUrl: './movie-delete.html',
  styleUrl: './movie-delete.scss',
})
export class MovieDelete implements OnInit, OnDestroy {
  readonly store = inject(MoviesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly id = signal(NaN);

  ngOnInit(): void {
    const routeId = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(routeId);
    if (!Number.isFinite(routeId)) {
      this.store.setError('Invalid movie id');
      return;
    }
    this.store.loadMovie(routeId);
  }

  confirmDelete(): void {
    const movieId = this.id();
    if (!Number.isFinite(movieId)) {
      return;
    }
    this.store.deleteMovie(movieId);
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.store.clearStatus();
    this.store.clearSelectedMovie();
  }
}
