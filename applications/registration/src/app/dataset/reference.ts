export interface Reference {
  uri: string;
  code: string;
  prefLabel: {
    [language: string]:string;
  };
  selected: boolean;
}
