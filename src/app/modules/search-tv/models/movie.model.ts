import {GenreModel} from "./genre.model";

export class MovieModel {
    id: number;
    external_id: number;
    title: string;
    popularity: number;
    release_date: string;
    genres: GenreModel[];
    vote_average: number;
    vote_count: number;
}
