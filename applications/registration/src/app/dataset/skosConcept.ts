export class SkosConcept {
    uri: string;
    prefLabel: {
        [language: string]: string
    };

    constructor(uri?: string, prefLabel?: {[language: string]: string}) {
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
    }
}