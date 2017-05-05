import {Injectable} from '@angular/core';

import { Distribution } from './distribution';
import { DISTRIBUTIONS } from './mock-distribution';

@Injectable()
export class DistributionService {
    getDistributions() : Distribution[] {
        return DISTRIBUTIONS;
    }

    getDistribution(number) {
        return DISTRIBUTIONS[number];
    }
}
