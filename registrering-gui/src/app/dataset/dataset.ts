export interface Dataset {
  id: string;
  title: {
    [language: string]:string
  };
  description: {
    [language: string]:string
  };/*
  keywords: {
    [language: string]:string[]
  };
  terms: {
    [language: string]:string[]
  };
  themes: string[];*/
  catalog: string;
  _lastModified: string;
}
