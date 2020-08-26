import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {SortEvent} from "../interfaces/sort-event.i";

@Injectable({
    providedIn: "root"
})
export class SortableTableService {
    private onSortSubject: Subject<SortEvent> = new Subject();

    public emitSort(event: SortEvent){
        this.onSortSubject.next(event);
    }

    public onSort(): Observable<SortEvent>{
        return this.onSortSubject;
    }
}
