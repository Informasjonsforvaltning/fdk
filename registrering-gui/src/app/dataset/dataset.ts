export interface Dataset {
  id: string;
  title: {
    [language: string]:string
  };
  description: {
    [language: string]:string
  };
  catalog: string;
}
