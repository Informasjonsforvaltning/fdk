import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {ReactiveFormsModule} from '@angular/forms'
import {HttpModule} from "@angular/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppComponent} from "./app.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {routes} from "./routes/app.routes";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {RouterModule} from "@angular/router";
import {AlertModule} from "ng2-bootstrap";
import {DatasetComponent} from "./dataset/dataset.component";
import {StartComponent} from "./start/start.component";
import {CatalogService} from "./catalog/catalog.service";
import {DatasetService} from "./dataset/dataset.service";
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from './confirm/confirm.component';
import {AuthGuard} from "./security/auth.guard";
import {AuthenticationService} from "./security/authentication.service";

import {SelectModule} from 'ng-select';
import {CodesService} from "./dataset/codes.service";

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    DatasetComponent,
    StartComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    HttpModule,
    NgbModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot(routes),
    BootstrapModalModule
  ],
  entryComponents: [
     ConfirmComponent
  ],
  providers: [CatalogService, DatasetService, CodesService, AuthGuard, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
