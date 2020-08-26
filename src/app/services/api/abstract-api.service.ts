import {Observable} from "rxjs";
import {ApiRequestParams} from "../../interfaces/api-request-params.i";
import {MoviesDataResponseModel} from "../../models/movies-data-response.model";

export abstract class AbstractApiService {
    public abstract searchMoviesNames$(params: ApiRequestParams): Observable<string[]>;

    public abstract fetchMoviesData$(params: ApiRequestParams): Observable<MoviesDataResponseModel>;
}
