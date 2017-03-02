import {CatalogComponent} from "../catalog/catalog.component";
import {DatasetComponent} from "../dataset/dataset.component";
import {StartComponent} from "../start/start.component";

export const routes = [
  { path: '', component: StartComponent, pathMatch: 'full' },
  { path: 'catalogs/:id', component: CatalogComponent, pathMatch: 'full'},
  { path: 'catalogs/:id/datasets/:id', component: DatasetComponent, pathMatch: 'full'}
];
