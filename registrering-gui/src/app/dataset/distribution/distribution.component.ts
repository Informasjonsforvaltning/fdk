import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'distribution',
    templateUrl: 'distribution.component.html'
})
export class DistributionComponent {
    // we will pass in address from App component
    @Input('group')
    public distributionForm: FormGroup;
}
