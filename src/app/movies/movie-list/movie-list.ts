import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoviesStore } from '../../store/movies.store';

/**
 * LIST with NgRx Signals:
 * inject MoviesStore → call loadMovies() → template reads store.movies() / store.loading().
 */
@Component({
  selector: 'app-movie-list',
  imports: [RouterLink],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit {
  // Store is providedIn:'root' — shared across routes like a mini global store.
  readonly store = inject(MoviesStore);

  ngOnInit(): void {
    this.store.loadMovies();
  }

  reload(): void {
    this.store.loadMovies();
  }
}
