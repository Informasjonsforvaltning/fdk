export interface BasisForProcessing {
  foafHomepage?: string;
  uri?: string;
  prefLabel?:{
    [language: string]:string
  };
  ui_visible?: boolean;
}
