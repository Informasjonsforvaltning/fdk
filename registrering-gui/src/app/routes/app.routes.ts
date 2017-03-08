import {CatalogComponent} from "../catalog/catalog.component";
import {DatasetComponent} from "../dataset/dataset.component";
import {StartComponent} from "../start/start.component";
import {LoginComponent} from "../login/login.component";

export const routes = [
  { path: '', component: StartComponent, pathMatch: 'full' },
  { path: 'catalogs/:cat_id', component: CatalogComponent, pathMatch: 'full'},
  { path: 'catalogs/:cat_id/datasets/:dataset_id', component: DatasetComponent, pathMatch: 'full'}
];
