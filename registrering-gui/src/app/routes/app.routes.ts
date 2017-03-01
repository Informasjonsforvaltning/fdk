import {AppComponent} from "../app.component";
import {CatalogComponent} from "../catalog/catalog.component";
import {DatasetComponent} from "../dataset/dataset.component";

export const routes = [
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: 'catalogs/:id', component: CatalogComponent, pathMatch: 'full'},
  { path: 'catalogs/:id/datasets/:id', component: DatasetComponent, pathMatch: 'full'}
];
