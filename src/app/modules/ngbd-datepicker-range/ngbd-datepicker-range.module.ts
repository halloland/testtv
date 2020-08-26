import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgbdDatepickerRangeComponent} from "./components/ngbd-datepicker-range/ngbd-datepicker-range.component";
import {NgbDatepickerModule, NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {NgbdDatepickerRangeDirective} from "./directives/ngbd-datepicker-range.directive";



@NgModule({
    declarations: [
        NgbdDatepickerRangeComponent,
        NgbdDatepickerRangeDirective
    ],
    exports: [
        NgbdDatepickerRangeComponent,
        NgbdDatepickerRangeDirective
    ],
    imports: [
        CommonModule,
        NgbDatepickerModule,
        NgbModalModule
    ]
})
export class NgbdDatepickerRangeModule {
}
