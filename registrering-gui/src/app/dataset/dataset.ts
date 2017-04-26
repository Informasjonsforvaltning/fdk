import {Contact} from "./contact";
import {Publisher} from "./publisher";
export interface Dataset {
  id: string;
  title: {
    [language: string]:string
  };
  description: {
    [language: string]:string
  };
  keywords: {
    [language: string]:string[]
  };
  terms: string[];
  theme: {code:string}[];
  catalog: string;

  landingPage : string[];

  publisher?: Publisher;

  contactPoint?: Contact[];

  _lastModified: string;
}
