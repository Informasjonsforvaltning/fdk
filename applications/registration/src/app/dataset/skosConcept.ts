export class SkosConcept {
    uri: string;
    prefLabel: {
        [language: string]: string
    };
    extraType?: string;

    constructor(uri?: string, prefLabel?: {[language: string]: string}, extraType?: string) {
        if (uri) {
            this.uri = uri;
        } else {
            this.uri = '';
        }
        if (prefLabel) {
            this.prefLabel = prefLabel;
        } else {
            this.prefLabel = { 'nb': '' };
        }
        if (extraType) {
          this.extraType = extraType;
        } else {
          this.extraType = '';
        }
    }
}