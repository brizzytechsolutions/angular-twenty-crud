import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MoviesStore } from '../../store/movies.store';

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MovieDetails implements OnInit, OnDestroy {
  readonly store = inject(MoviesStore);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.store.setError('Invalid movie id');
      return;
    }
    this.store.loadMovie(id);
  }

  ngOnDestroy(): void {
    this.store.clearSelectedMovie();
  }
}
