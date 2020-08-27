import {AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {SortDirection} from "../types/sort-direction.type";
import {SortEvent} from "../interfaces/sort-event.i";
import {SortableTableService} from "../services/sortable-table.service";

@Directive({
    selector: "th[sortable]",
    host: {
        "[class.asc]": "direction === \"asc\"",
        "[class.desc]": "direction === \"desc\"",
        "(click)": "sort()"
    }
})
export class SortableHeaderDirective implements AfterViewInit {
    @Input() sortable: string = "";
    @Input() direction: SortDirection = "";
    @Output() onSort = new EventEmitter<SortEvent>();

    private rotate: { [key: string]: SortDirection } = {"asc": "desc", "desc": "", "": "asc"};

    constructor(private service: SortableTableService, private elRef: ElementRef) {

    }

    ngAfterViewInit(): void {
        this.createSortDom();
    }

    public sort(): void {
        this.direction = this.rotate[this.direction];
        const event = {column: this.sortable, direction: this.direction};
        this.onSort.emit(event);
        this.service.emitSort(event);
    }

    private createSortDom(): void{
        const sortIconsContainer = document.createElement("div");
        sortIconsContainer.classList.add("sort");

        sortIconsContainer.appendChild(this.createSortIconDom("up"));
        sortIconsContainer.appendChild(this.createSortIconDom("down"));

        const sortContainer = this.createSortContainer();

        sortContainer.appendChild(sortIconsContainer);

        this.elRef.nativeElement.appendChild(sortContainer);
    }

    private createSortContainer(): HTMLElement{
        const sortContainer = document.createElement("div");
        sortContainer.classList.add("sort-container");

        this.elRef.nativeElement.childNodes.forEach((node) => {
            sortContainer.appendChild(node);
        });

        return sortContainer;
    }

    private createSortIconDom(type: "up" | "down"): HTMLElement{
        const sort = document.createElement("i");
        sort.classList.add("fas");
        sort.classList.add("fa-angle-" + type);

        return sort;
    }
}
