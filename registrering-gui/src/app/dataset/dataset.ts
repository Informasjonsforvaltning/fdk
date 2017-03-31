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
  _lastModified: string;
}
