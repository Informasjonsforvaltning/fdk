import {Skoscode} from './skoscode';
import {SkosConcept} from './skosConcept';

export interface Reference {
    referenceType: {
        uri: string;
        code: string;
        prefLabel: {
            [language: string]: string;
        };
    };
    source: SkosConcept;
}
