import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {NgbCalendar, NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbdDatepickerRangeEvent} from "../../interfaces/ngbd-datepicker-event.i";
import {fromPromise} from "rxjs/internal-compatibility";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
    selector: 'ngbd-datepicker-range',
    templateUrl: './ngbd-datepicker-range.component.html',
    styleUrls: ["./ngbd-datepicker-range.component.scss"]
})
export class NgbdDatepickerRangeComponent{

    hoveredDate: NgbDate | null = null;

    fromDate: NgbDate;
    toDate: NgbDate | null = null;

    @Input() template = "";
    @Output() onChange: EventEmitter<NgbdDatepickerRangeEvent> = new EventEmitter();

    @ViewChild('modalContent') modalContent: TemplateRef<any>;


    constructor(private calendar: NgbCalendar, private modalService: NgbModal) {
        this.fromDate = this.calendar.getToday();
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }

        if(this.toDate && this.fromDate){
            this.onChange.emit({from: this.fromDate, to: this.toDate});
        }
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    public isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    public isRange(date: NgbDate): boolean {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
    }

    public openInModal(): Observable<NgbdDatepickerRangeEvent> {
        return fromPromise(this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title'}).result).pipe(
            map(() => {
                return {from: this.fromDate, to: this.toDate}
            })
        )
    }

    public reset(){
        this.fromDate = this.calendar.getToday();
        this.toDate = null;
    }
}
