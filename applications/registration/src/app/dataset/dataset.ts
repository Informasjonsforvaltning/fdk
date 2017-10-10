import {Contact} from "./contact/contact";
import {Publisher} from "./publisher";
import {Distribution} from "./distribution/distribution";
import {PeriodOfTime} from "./temporal/periodoftime";
import {Skoscode} from './skoscode';
/**
 * WARNING pluralize arrays will append s to array name if singular and overwrite with an empty array.
 */


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
  objective?: {
    [language: string]:string
  };
  themes?: {uri:string, title:{"nb":string}}[];
  catalog: string;
  accrualPeriodicity?: {uri:string, prefLabel:{"no": string}};
  provenance?: {uri:string, prefLabel:{"nb":string}};

  spatials?: {uri:string, prefLabel:{"nb":string}}[];

  landingPages?: string[];

  identifiers: string[];

  publisher?: Publisher;

  contactPoints?: Contact[];

  conformsTos?: string[];

  distributions?: Distribution[];

  samples?: Distribution[];

  modified?:string;

  issued?: string;

  languages?: Skoscode[];

  temporals?: PeriodOfTime[];

  type?: string;
  legalBasisForRestrictions?:any[];
  legalBasisForProcessings?:any[];
  legalBasisForAccesses?:any[];

  informationModel?:any;

  hasAccuracyAnnotation?:any;
  hasCompletenessAnnotation?:any;
  hasCurrentnessAnnotation?:any;
  hasAvailabilityAnnotation?:any;
  hasRelevanceAnnotation?:any;

  _lastModified: string;

  registrationStatus? : string;
}
