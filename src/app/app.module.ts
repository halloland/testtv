import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {NgbDatepickerModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";
import {SortableTableModule} from "./modules/sortable-table/sortable-table.module";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {NgbdDatepickerRangeModule} from "./modules/ngbd-datepicker-range/ngbd-datepicker-range.module";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SortableTableModule,
        NgbModule,
        NgxSkeletonLoaderModule,
        NgbDatepickerModule,
        NgbdDatepickerRangeModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
