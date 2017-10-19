import {SkosConcept} from '../skosConcept';
export interface Distribution {
    id?: string;
    uri?: string;
    type?: string;
    title?: {[language: string]: string};
    description?: {[language: string]: string};
    downloadURL?: string[];
    accessURL?: string[];
    format?: string[];
    license?: SkosConcept;
    conformsTo?: SkosConcept[];
    page?: SkosConcept[];
}
