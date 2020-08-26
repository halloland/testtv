import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap} from "rxjs/operators";
import {SortEvent} from "./modules/sortable-table/interfaces/sort-event.i";
import {MoviesDataResponseModel} from "./models/movies-data-response.model";
import {MovieModel} from "./models/movie.model";
import {GenreModel} from "./models/genre.model";
import {ApiRequestParams} from "./interfaces/api-request-params.i";
import {SortableColumns} from "./enums/sortable-columns";
import {Observable, of, Subscription} from "rxjs";
import {NgbdDatepickerRangeEvent} from "./modules/ngbd-datepicker-range/interfaces/ngbd-datepicker-event.i";
import moment from "moment";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {BaseApiService} from "./services/api/base-api.service";
import {SortType} from "./enums/sort-type";


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    public movies: MovieModel[] = [];
    public perPages = [
        {
            count: 5,
            active: true
        },
        {
            count: 10,
            active: false
        },
        {
            count: 25,
            active: false
        }
    ];

    public activePage: number = 1;
    public totalItems: number = 0;
    public loading: boolean = false;
    public didFirstLoad = false;
    public error: boolean = false;
    public sortableColumns = SortableColumns;
    public activeGenre: GenreModel;
    public genres: GenreModel[] = [];
    public apiRequestParams: ApiRequestParams = {
        page: 1,
        per_page: 5
    };

    private requestSubscription: Subscription;

    constructor(private httpClient: HttpClient, private apiService: BaseApiService) {
        this.fetchApiData();
    }

    get activePerPage(){
        return this.perPages.find((perPage) => perPage.active);
    }

    public onTableSort(event: SortEvent): void {
        if((<any> Object).values(SortableColumns).includes(event.column) && event.direction !== ""){
            this.apiRequestParams.sort_by = event.column as SortableColumns;
        } else {
            delete this.apiRequestParams.sort_by;
        }

        this.apiRequestParams.sort_type = event.direction as SortType;

        this.fetchApiData();
    }

    public onPerPageChange(perPage: {count: number, active: boolean}): void{
        if(!perPage.active){
            this.apiRequestParams.per_page = perPage.count;
            this.activePerPage.active = false;
            perPage.active = true;

            this.fetchApiData();
        }
    }

    public onPageChange(page: number): void{
        this.apiRequestParams.page = page;

        this.fetchApiData();
    }

    public onGenreChange(genre: GenreModel): void{
        if(this.activeGenre === genre){
            return;
        }

        if(genre){
            this.apiRequestParams.genre_id = genre.external_id;
        } else {
            delete this.apiRequestParams.genre_id;
        }

        this.activeGenre = genre;

        this.fetchApiData();
    }

    public onRangeDateChange(event: NgbdDatepickerRangeEvent): void{
        this.apiRequestParams.premier_year_start = AppComponent.getApiDateFromNgb(event.from);
        this.apiRequestParams.premier_year_end = AppComponent.getApiDateFromNgb(event.to);

        this.fetchApiData();
    }

    public onRangeDateReset(): void{
        delete this.apiRequestParams.premier_year_start;
        delete this.apiRequestParams.premier_year_end;

        this.fetchApiData();
    }

    public searchName(text$: Observable<string>): Observable<any>{
        return text$.pipe(
            map((text) => text.trim()),
            tap((text) => this.apiRequestParams.name = text),
            filter((text) => text.length > 0),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((text) => {
                this.apiRequestParams.name = text;
                return this.apiService.searchMoviesNames$(this.apiRequestParams)
            }),
            catchError((err) => {
                // TODO handle error
                console.warn(err);
                return []
            })
        )
    }

    public nameSelect(event): void{
        this.apiRequestParams.name = event.item;
        this.fetchApiData();
        event.preventDefault();
    }

    public onNameChange(event): void{
        this.apiRequestParams.name = event.target.value;
        this.fetchApiData();
    }

    public resendRequest(): void{
        this.error = false;
        this.fetchApiData();
    }

    public genreTrackBy(index, item: GenreModel): number {
        return item.id;
    }

    private static getApiDateFromNgb(date: NgbDate): string{
        return moment(`${date.year}-${date.month}-${date.day}`).format("yy-MM-DD");
    }

    private fetchApiData(): void{
        this.requestSubscription?.unsubscribe();
        if(this.didFirstLoad){
            this.loading = true;
        }
        this.requestSubscription = this.apiService.fetchMoviesData$(this.apiRequestParams).pipe(
            tap((res: MoviesDataResponseModel) => {
                this.error = false;
                this.handleResponse(res);
            }),
            catchError(() => {
                this.error = true;

                window.scrollTo({top: 0});
                return of(null);
            }),
            finalize(() => {
                this.loading = false;
            })
        ).subscribe();
    }



    private handleResponse(res: MoviesDataResponseModel): void{
        this.movies = res.movies.map((movie) => {
            movie.release_date = moment(movie.release_date).format("DD.MM.yy");

            return movie;
        });
        this.totalItems = res.total;
        this.genres = res.genres;
        this.didFirstLoad = true;
    }
}
