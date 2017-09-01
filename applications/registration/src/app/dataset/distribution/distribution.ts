export interface Distribution {
  id?: string;
  uri?: string;
  title?: {
    [language: string]:string
  };
  description?: {
    [language: string]:string
  };
  accessURL?: string[];
  downloadURL?: string[];
  license?: string;
  format?: string[];
  ui_visible?:boolean;
}
