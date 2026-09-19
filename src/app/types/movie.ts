export interface Movie {
  id: number; // MS SQL identity column
  title: string;
  director: string;
  genre: string;
  year_of_release: number;
}

export type CreateMovie = Omit<Movie, 'id'>;
export type UpdateMovie = Partial<CreateMovie>;
