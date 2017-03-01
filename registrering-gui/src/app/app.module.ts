import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppComponent} from "./app.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {routes} from "./routes/app.routes";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {RouterModule} from "@angular/router";
import {AlertModule} from "ng2-bootstrap";
import {DatasetComponent} from "./dataset/dataset.component";

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    DatasetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
