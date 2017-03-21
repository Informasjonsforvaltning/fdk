import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DatasetService} from "./dataset.service";
import {CatalogService} from "../catalog/catalog.service";
import {Dataset} from "./dataset";

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css', '../../assets/css/designsystem.css', '../../assets/css/registrering.css']
})
export class DatasetComponent implements OnInit {
  title = 'Registrer datasett';
  dataset: Dataset;
  // title: string;
  description: string;
  language: string;
  timer: number;
  saved: boolean;
  catId: string;
  lastSaved: string;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DatasetService,
    private catalogService: CatalogService
  ) { }

  ngOnInit() {
    this.language = 'nb';
    this.timer = 0;
    // snapshot alternative
    this.catId = this.route.snapshot.params['cat_id'];
    let datasetId = this.route.snapshot.params['dataset_id'];
    this.service.get(this.catId, datasetId).then((dataset: Dataset) => this.dataset = dataset);
  }

  save(): void {
    this.service.save(this.catId, this.dataset)
      .then(() => {
        this.saved = true;
        var d = new Date();
        this.lastSaved = ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
      })
  }
  valuechange(a,b,c): void {
    var that = this;
    this.delay(function() {that.save.call(that)}, 1000);
  }
  delay(callback, ms): void{
      clearTimeout (this.timer);
      this.timer = setTimeout(callback, ms);
  };

  back(): void {
    this.router.navigate(['/catalogs', this.catId]);
  }

}
