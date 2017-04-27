export interface Distribution {
  id?: string;
  uri?: string;
  title?: {
    [language: string]:string
  };
  description?: {
    [language: string]:string
  };
  accessUrl?: string[];
  license?: string;
  format: string[];
}

