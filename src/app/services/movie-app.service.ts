import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { CreateMovie, Movie, UpdateMovie } from '../types/movie';

/**
 * HTTP stays Observable-based (HttpClient is RxJS-native).
 * Components convert results into signals with .subscribe() + signal.set().
 */
@Injectable({ providedIn: 'root' })
export class MovieAppService {
  private readonly http = inject(HttpClient);
  private readonly cfg = inject(AppConfigService);

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(`${this.cfg.apiBaseUrl()}/movies`)
      .pipe(catchError(this.handleError));
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http
      .get<Movie>(`${this.cfg.apiBaseUrl()}/movies/${id}`)
      .pipe(catchError(this.handleError));
  }

  createMovie(data: CreateMovie): Observable<Movie> {
    return this.http
      .post<Movie>(`${this.cfg.apiBaseUrl()}/movies`, data)
      .pipe(catchError(this.handleError));
  }

  updateMovie(id: number, data: UpdateMovie): Observable<Movie> {
    return this.http
      .put<Movie>(`${this.cfg.apiBaseUrl()}/movies/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteMovie(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.cfg.apiBaseUrl()}/movies/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: unknown): Observable<never> => {
    if (error instanceof HttpErrorResponse) {
      console.error('HTTP Error:', error.status, error.message);
    } else {
      console.error('Unknown error:', error);
    }
    return throwError(() => error);
  };
}
