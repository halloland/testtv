import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: "search",
                    loadChildren: () => import("./modules/search-tv/search-tv.module").then(m => m.SearchTvModule)
                },
            ]
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
