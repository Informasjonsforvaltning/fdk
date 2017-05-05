import {OnInit, Component, Input} from "@angular/core";
import {Dataset} from "../dataset/dataset";
import {Distribution} from "./distribution";
import {DistributionService} from "./distribution.service";

@Component({
    selector: 'distribution',
    templateUrl: './distribution.component.html',
    styleUrls: ['./distribution.component.css', '../../assets/css/designsystem.css', '../../assets/css/registrering.css']
})// class Select

export class DistributionComponent implements OnInit {
    title = 'Registrer datasett';
    @Input() distribution: Distribution;
    dataset: Dataset;

    ngOnInit(): void {
        this.getDistributions();
    }

    getDistributions(): void {
        this.distribution = this.distributionService.getDistribution(0);
    }

    constructor(private distributionService: DistributionService) {}
}
