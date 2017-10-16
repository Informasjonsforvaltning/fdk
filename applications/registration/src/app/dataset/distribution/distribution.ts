import {SkosConcept} from '../skosConcept';
export interface Distribution {
    id?: string;
    uri?: string;
    type?: string;
    title?: {[language: string]: string};
    description?: {[language: string]: string};
    downloadURLs?: string[];
    accessURLs?: string[];
    formats?: string[];
    license?: SkosConcept; 
    conformsTos?: SkosConcept[]; 
    page?: SkosConcept;
}