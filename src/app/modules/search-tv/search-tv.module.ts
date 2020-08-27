import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SearchTvPage} from "./pages/search-tv/search-tv.page";
import {SearchTvRoutingModule} from "./search-tv-routing.module";
import {SortableTableModule} from "../sortable-table/sortable-table.module";
import {NgbDatepickerModule, NgbModalModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {NgbdDatepickerRangeModule} from "../ngbd-datepicker-range/ngbd-datepicker-range.module";
import {FormsModule} from "@angular/forms";
import {InfiniteScrollModule} from "ngx-infinite-scroll";


@NgModule({
    declarations: [SearchTvPage],
    imports: [
        CommonModule,
        SearchTvRoutingModule,
        SortableTableModule,
        NgbModule,
        NgxSkeletonLoaderModule,
        NgbDatepickerModule,
        NgbdDatepickerRangeModule,
        NgbModalModule,
        FormsModule,
        InfiniteScrollModule
    ]
})
export class SearchTvModule {
}
