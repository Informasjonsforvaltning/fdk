import {Contact} from "./contact/contact";
import {Publisher} from "./publisher";
import {Distribution} from "./distribution/distribution";
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

  accessRights?: {uri:string};
  accessRightsComments?: string[];
      /*
  processing?: {
        [language: string]: string
    }[];
  delivery?: {
        [language: string]: string
    }[]; */
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

  _lastModified: string;
}
