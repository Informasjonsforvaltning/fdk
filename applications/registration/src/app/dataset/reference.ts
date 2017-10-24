import {Skoscode} from './skoscode';
import {SkosConcept} from './skosConcept';

export interface Reference {
  referenceType: Skoscode;
  source: SkosConcept;
}
