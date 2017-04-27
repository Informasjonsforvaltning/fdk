import {Contact} from "./contact";
import {Publisher} from "./publisher";
import {Distribution} from "../distribution/distribution";
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
  theme?: {uri:string}[];
  catalog: string;
  accrualPeriodicity?: {uri:string, prefLabel:{"no": string}};
  provenance?: {uri:string, prefLabel:{"nb":string}};

  landingPage?: string[];

  publisher?: Publisher;

  contactPoint?: Contact[];

  distribution?: Distribution[];

  _lastModified: string;
}
