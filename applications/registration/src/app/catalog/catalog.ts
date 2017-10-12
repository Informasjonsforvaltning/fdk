export interface Catalog {
  id: string;
  title: {
    [language: string]:string
  };
  description: {
    [language: string]:string
  };
  publisher?: {
    uri: string;
    id: string;
    name: string;
  }
}
