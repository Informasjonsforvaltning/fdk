//
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
  theme: {code:string}[]; // , title:string, uri:string, pickedDate:string
  catalog: string;

  landingPage : string[];

  publisher?: {
    uri: string;
    id: string;
    name: string;
  };

  _lastModified: string;
}
