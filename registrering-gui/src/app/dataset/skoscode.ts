export interface Skoscode {
  uri: string;
  code: string;
  prefLabel: {
    [language: string]:string;
  };
  selected: boolean;
}
