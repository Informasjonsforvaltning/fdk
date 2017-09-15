export interface LegalBasisForAccess {
  foafHomepage?: string;
  uri?: string;
  prefLabel?:{
    [language: string]:string
  };
  ui_visible?:boolean;
}
