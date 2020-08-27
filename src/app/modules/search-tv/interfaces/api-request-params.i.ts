import {SortableColumns} from "../enums/sortable-columns";
import {SortType} from "../enums/sort-type";
import {ApiAction} from "../enums/api-action";

export interface ApiRequestParams {
    name?: string;
    genre_id?: number;
    premier_year_start?: string;
    premier_year_end?: string;
    sort_by?: SortableColumns;
    sort_type?: SortType;
    page?: number;
    per_page?: number;
    action?: ApiAction
}
