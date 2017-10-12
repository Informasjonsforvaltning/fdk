package no.dcat.authorization;

import lombok.Data;

@Data
public class OpenDataEnhet {
    String organisasjonsnummer;
    String navn;
    OpenDataOrganisasjonsform orgform;

    public OpenDataEnhet() {
        //Default constructur used by frameworks
    }

    public OpenDataEnhet(String organisasjonsnummer, String navn, OpenDataOrganisasjonsform orgform) {
        this.organisasjonsnummer = organisasjonsnummer;
        this.navn = navn;
        this.orgform = orgform;
    }
}
