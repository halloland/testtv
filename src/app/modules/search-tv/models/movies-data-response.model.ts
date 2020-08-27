import {GenreModel} from "./genre.model";
import {MovieModel} from "./movie.model";

export class MoviesDataResponseModel {
    genres: GenreModel[];
    movies: MovieModel[];
    total: number;
}
