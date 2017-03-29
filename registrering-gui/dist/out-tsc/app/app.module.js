var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "./app.component";
import { CatalogComponent } from "./catalog/catalog.component";
import { routes } from "./routes/app.routes";
import { RouterModule } from "@angular/router";
import { AlertModule } from "ng2-bootstrap";
import { DatasetComponent } from "./dataset/dataset.component";
import { StartComponent } from "./start/start.component";
import { CatalogService } from "./catalog/catalog.service";
import { DatasetService } from "./dataset/dataset.service";
import { AuthGuard } from "./security/auth.guard";
import { AuthenticationService } from "./security/authentication.service";
import { SelectModule } from 'angular2-select';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            CatalogComponent,
            DatasetComponent,
            StartComponent
        ],
        imports: [
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            SelectModule,
            HttpModule,
            NgbModule.forRoot(),
            AlertModule.forRoot(),
            RouterModule.forRoot(routes)
        ],
        providers: [CatalogService, DatasetService, AuthGuard, AuthenticationService],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=../../../src/app/app.module.js.map