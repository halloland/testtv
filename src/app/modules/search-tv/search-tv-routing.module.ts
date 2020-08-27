import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {SearchTvPage} from "./pages/search-tv/search-tv.page";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                component: SearchTvPage
            }
        ])
    ],
    exports: [RouterModule]
})
export class SearchTvRoutingModule {

}
