import {Contact} from "./contact";
import {Publisher} from "./publisher";
export interface Dataset {
  id: string;
  title?: {
    [language: string]:string
  };
  description?: {
    [language: string]:string
  };
  keywords?: {
    [language: string]:string[]
  };
  subject?: string[];
  themes?: {uri:string}[];
  catalog: string;
  accrualPeriodicity?: {uri:string, prefLabel:{"no": string}};
  provenance?: {uri:string, prefLabel:{"nb":string}};

  landingPages?: string[];

  identifier: string[];

  publisher?: Publisher;

  contactPoints?: Contact[];

  _lastModified: string;
}
