import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AbstractApiService} from "./abstract-api.service";
import {MoviesDataResponseModel} from "../../models/movies-data-response.model";
import {Observable} from "rxjs";
import {ApiRequestParams} from "../../interfaces/api-request-params.i";
import {map} from "rxjs/operators";
import {ApiAction} from "../../enums/api-action";

@Injectable({
    providedIn: "root"
})
export class BaseApiService extends AbstractApiService{
    private static BaseAPIURL = "http://localhost:8090/api.php";

    constructor(private httpClient: HttpClient) {
        super();
    }

    public fetchMoviesData$(params: ApiRequestParams): Observable<MoviesDataResponseModel> {
        params.action = ApiAction.FetchMoviesData;

        return this.makeRequestWithParams$(params).pipe(
            map((res) => res as MoviesDataResponseModel)
        )
    }

    public searchMoviesNames$(params: ApiRequestParams): Observable<string[]> {
        params.action = ApiAction.SearchMoviesNames;

        return this.makeRequestWithParams$(params).pipe(
            map((res) => res as string[])
        );
    }

    private makeRequestWithParams$(params: ApiRequestParams): Observable<Object>{
        return this.httpClient.get(BaseApiService.BaseAPIURL, {
            params: params as HttpParams
        });
    }

}
