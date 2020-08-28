import {Component, ElementRef, TemplateRef, ViewChild} from "@angular/core";
import {MovieModel} from "../../models/movie.model";
import {SortableColumns} from "../../enums/sortable-columns";
import {GenreModel} from "../../models/genre.model";
import {ApiRequestParams} from "../../interfaces/api-request-params.i";
import {fromEvent, Observable, of, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BaseApiService} from "../../services/api/base-api.service";
import {SortEvent} from "../../../sortable-table/interfaces/sort-event.i";
import {SortType} from "../../enums/sort-type";
import {NgbdDatepickerRangeEvent} from "../../../ngbd-datepicker-range/interfaces/ngbd-datepicker-event.i";
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    skipWhile,
    switchMap,
    tap
} from "rxjs/operators";
import {NgbDate, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import {MoviesDataResponseModel} from "../../models/movies-data-response.model";
import {ScreenHelper} from "../../../../helpers/screen-helper";

@Component({
    selector: "search-tv",
    templateUrl: "./search-tv.page.html",
    styleUrls: ["./search-tv.page.scss"]
})
export class SearchTvPage {

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
    public filterBtnActive: boolean = false;
    public searchContainerSticky: boolean = false;
    public apiRequestParams: ApiRequestParams = {
        page: 1,
        per_page: 5
    };
    public sorts = [
        {
            name: "Name",
            sort_name: SortableColumns.Title
        },
        {
            name: "Popularity",
            sort_name: SortableColumns.Popularity
        },
        {
            name: "Rating",
            sort_name: SortableColumns.Vote_average
        },
        {
            name: "Premiere",
            sort_name: SortableColumns.Release_date
        }
    ];

    @ViewChild("searchContainer") searchContainer: ElementRef;
    @ViewChild("sortModal") sortModal: TemplateRef<any>;

    private requestSubscription: Subscription;
    private modalRef: NgbModalRef;

    constructor(private httpClient: HttpClient, private apiService: BaseApiService, private modalService: NgbModal) {
        this.fetchApiData();
        this.handleScroll();
     }

    public onTableSort(event: SortEvent): void {
        this.modalRef?.close();

        if ((<any>Object).values(SortableColumns).includes(event.column) && event.direction !== "") {
            this.apiRequestParams.sort_by = event.column as SortableColumns;
        } else {
            delete this.apiRequestParams.sort_by;
        }

        this.apiRequestParams.sort_type = event.direction as SortType;
        this.resetMovies();
        this.fetchApiData();
    }

    public onPerPageChange(perPage: { count: number, active: boolean }): void {
        if (!perPage.active) {
            this.apiRequestParams.per_page = perPage.count;
            this.activePerPage.active = false;
            perPage.active = true;
            this.resetMovies();
            this.fetchApiData();
        }
    }

    public onPageChange(page: number): void {
        this.apiRequestParams.page = page;
        this.fetchApiData();
    }

    public onGenreChange(genre: GenreModel): void {
        if (this.activeGenre === genre) {
            return;
        }

        if (genre) {
            this.apiRequestParams.genre_id = genre.external_id;
        } else {
            delete this.apiRequestParams.genre_id;
        }

        this.activeGenre = genre;
        this.resetMovies();
        this.fetchApiData();
    }

    public onRangeDateChange(event: NgbdDatepickerRangeEvent): void {
        this.apiRequestParams.premier_year_start = SearchTvPage.getApiDateFromNgb(event.from);
        this.apiRequestParams.premier_year_end = SearchTvPage.getApiDateFromNgb(event.to);
        this.resetMovies();
        this.fetchApiData();
    }

    public onRangeDateReset(): void {
        delete this.apiRequestParams.premier_year_start;
        delete this.apiRequestParams.premier_year_end;
        this.resetMovies();
        this.fetchApiData();
    }

    public searchName(text$: Observable<string>): Observable<any> {
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
            catchError(() => {
                // TODO handle error
                return []
            })
        )
    }

    public nameSelect(event): void {
        this.apiRequestParams.name = event.item;
        this.resetMovies();
        this.fetchApiData();
        event.preventDefault();
    }

    public onNameChange(event): void {
        this.apiRequestParams.name = event.target.value;
        this.resetMovies();
        this.fetchApiData();
    }

    public resendRequest(): void {
        this.error = false;
        this.fetchApiData();
    }

    public genreTrackBy(index, item: GenreModel): number {
        return item.id;
    }

    public onInfiniteScroll(): void {
            this.activePage += 1;
            this.onPageChange(this.activePage);
    }

    public get isInfiniteDisabled(): boolean{
        return this.loading || this.movies.length >= this.totalItems || !ScreenHelper.isMobileScreen();
    }

    public openFilter(): void{
        this.searchContainerSticky = true;
    }

    public closeFilter(): void{
        this.searchContainerSticky = false;
    }

    public openSortModal(): void{
        this.modalRef = this.modalService.open(this.sortModal);
    }

    get activePerPage() {
        return this.perPages.find((perPage) => perPage.active);
    }

    private fetchApiData(): void {
        this.requestSubscription?.unsubscribe();
        if (this.didFirstLoad) {
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

    private handleScroll(): void{
        fromEvent(window, "scroll").pipe(
            skipWhile(() => !ScreenHelper.isMobileScreen()),
            tap(() => {
                const element: HTMLElement = this.searchContainer.nativeElement;

                this.filterBtnActive = window.pageYOffset > element.offsetTop + element.clientHeight;

                if(!this.filterBtnActive){
                    this.searchContainerSticky = false;
                }
            })
        ).subscribe();
    }

    private resetMovies(): void {
        if (ScreenHelper.isMobileScreen()) {
            this.activePage = 1;
            this.apiRequestParams.page = 1;
            this.movies = [];

            this.searchContainerSticky = false;
        }
    }

    private handleResponse(res: MoviesDataResponseModel): void {
        res.movies = res.movies.map((movie) => {
            movie.release_date = moment(movie.release_date).format("DD.MM.yy");

            return movie;
        });

        if (ScreenHelper.isMobileScreen()) {
            this.movies.push(...res.movies);
        } else {
            this.movies = res.movies;
        }

        this.totalItems = res.total;

        this.genres = res.genres;
        this.didFirstLoad = true;
    }

    private static getApiDateFromNgb(date: NgbDate): string {
        return moment(`${date.year}-${date.month}-${date.day}`).format("yy-MM-DD");
    }


}
