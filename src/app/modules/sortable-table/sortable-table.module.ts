import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableTableComponent } from './components/sortable-table/sortable-table.component';
import {SortableHeaderDirective} from "./directives/sortable-header.directive";

@NgModule({
    declarations: [
        SortableTableComponent,
        SortableHeaderDirective
    ],
    exports: [
        SortableTableComponent,
        SortableHeaderDirective
    ],
    imports: [
        CommonModule
    ]
})
export class SortableTableModule { }
