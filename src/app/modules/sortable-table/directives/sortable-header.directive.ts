import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {SortDirection} from "../types/sort-direction.type";
import {SortEvent} from "../interfaces/sort-event.i";
import {SortableTableService} from "../services/sortable-table.service";

@Directive({
    selector: 'th[sortable]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'sort()'
    }
})
export class SortableHeaderDirective implements AfterViewInit {
    @Input() sortable: string = '';
    @Input() direction: SortDirection = '';
    @Output() onSort = new EventEmitter<SortEvent>();

   private rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

   constructor(private service: SortableTableService, private elRef: ElementRef) {

   }

    ngAfterViewInit(): void {
        const sortIconsContainer = document.createElement("div");
        sortIconsContainer.classList.add("sort");
        const sortUp = document.createElement("i");
        sortUp.classList.add("fas");
        const sortDown = sortUp.cloneNode() as HTMLElement;

        sortUp.classList.add("fa-angle-up");
        sortDown.classList.add("fa-angle-down");

        sortIconsContainer.appendChild(sortUp);
        sortIconsContainer.appendChild(sortDown);
        const sortContainer = document.createElement("div");
        sortContainer.classList.add("sort-container");

        this.elRef.nativeElement.childNodes.forEach((node) => {
            sortContainer.appendChild(node);
        });
        sortContainer.appendChild(sortIconsContainer);

        this.elRef.nativeElement.appendChild(sortContainer)
   }

    sort() {
        this.direction = this.rotate[this.direction];
        const event = {column: this.sortable, direction: this.direction};
        this.onSort.emit(event);
        this.service.emitSort(event);
    }
}
