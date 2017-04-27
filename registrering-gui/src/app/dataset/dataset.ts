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
  theme?: {uri:string}[];
  catalog: string;
  accrualPeriodicity?: {uri:string, prefLabel:string};
  provenanceStatement?: {uri:string, prefLabel:string};

  landingPage?: string[];

  publisher?: Publisher;

  contactPoint?: Contact[];

  _lastModified: string;
}
