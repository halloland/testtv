import {SortDirection} from "../types/sort-direction.type";

export interface SortEvent {
    column: string;
    direction: SortDirection;
}
