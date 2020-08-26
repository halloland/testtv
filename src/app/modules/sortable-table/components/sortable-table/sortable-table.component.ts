import {Component, ContentChildren, EventEmitter, Output, QueryList} from "@angular/core";
import {SortEvent} from "../../interfaces/sort-event.i";
import {SortableHeaderDirective} from "../../directives/sortable-header.directive";
import {SortableTableService} from "../../services/sortable-table.service";
import {tap} from "rxjs/operators";

@Component({
    selector: "sortable-table",
    templateUrl: "./sortable-table.component.html",
    styleUrls: ["./sortable-table.component.scss"]
})
export class SortableTableComponent{
    @Output() onSort = new EventEmitter<SortEvent>();

    @ContentChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

    constructor(private service: SortableTableService) {
        this.handleSort();
    }


    handleSort(){
        this.service.onSort().pipe(
            tap((event) => {
                this.headers.forEach((header) => {
                    if (header.sortable !== event.column){
                        header.direction = "";
                    }
                });

                this.onSort.emit(event);
            })
        ).subscribe();
    }
}
