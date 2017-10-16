import {Skoscode} from './skoscode';
import {Dataset} from './dataset';

export interface Reference {
  referenceType: Skoscode;
  source: Dataset;
}
