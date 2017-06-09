import {Contact} from "./contact/contact";
import {Publisher} from "./publisher";
import {Distribution} from "./distribution/distribution";
import {Skoscode} from './skoscode';
export interface Dataset {
  id: string;
  title?: {
    [language: string]:string
  };
  description?: {
    [language: string]:string
  };
  keywords?: {
      [language: string]: string
  }[];
  subjects?: string[];
  themes?: {uri:string, title:{"nb":string}}[];
  catalog: string;
  accrualPeriodicity?: {uri:string, prefLabel:{"no": string}};
  provenance?: {uri:string, prefLabel:{"nb":string}};

  landingPages?: string[];

  identifiers: string[];

  publisher?: Publisher;

  contactPoints?: Contact[];

  conformsTos?: string[];

  distributions?: Distribution[];


  modified?:string;

  issued?: string;

  languages?: Skoscode[];

  samples?: Distribution[]; 

  _lastModified: string;
}
