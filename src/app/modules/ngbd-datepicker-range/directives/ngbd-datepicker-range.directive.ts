import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    EventEmitter,
    HostListener,
    Output,
    ViewContainerRef
} from "@angular/core";
import {NgbdDatepickerRangeComponent} from "../components/ngbd-datepicker-range/ngbd-datepicker-range.component";
import {catchError, tap} from "rxjs/operators";
import {NgbdDatepickerRangeEvent} from "../interfaces/ngbd-datepicker-event.i";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import {of} from "rxjs";

@Directive({
    selector: "input[ngbdDatepickerRange]",
    host: {
        '(click)': 'open()',
        '[value]': 'displayValue'
    }
})
export class NgbdDatepickerRangeDirective{
    @Output() onChange: EventEmitter<NgbdDatepickerRangeEvent> = new EventEmitter();
    @Output() onReset: EventEmitter<NgbdDatepickerRangeEvent> = new EventEmitter();

    public displayValue: string = "";

    private datepicker: ComponentRef<NgbdDatepickerRangeComponent>;

    constructor(private viewContainerRef: ViewContainerRef, private resolver: ComponentFactoryResolver) {
        const factory = this.resolver.resolveComponentFactory(NgbdDatepickerRangeComponent);

        this.datepicker = this.viewContainerRef.createComponent(factory);

        this.datepicker.instance.template = "modal";
    }

    @HostListener('keydown', ['$event, $event.target'])
    onKeyUp(event) {
       event.preventDefault();
    }

    public open(){
        this.datepicker.instance.openInModal().pipe(
            tap((res) => {
                if(res.from && res.to){
                    this.displayValue = `${this.formatDate(res.from)} - ${this.formatDate(res.to)}`;
                    this.onChange.next(res);
                } else {
                    this.displayValue = ``;
                    this.onReset.next();
                }

            }),
            catchError(() => {
                return of(false);
            })
        ).subscribe();
    }

    private formatDate(date: NgbDate): string{
        return moment(`${date.year}-${date.month}-${date.day}`).format("DD.MM.yy");
    }
}
