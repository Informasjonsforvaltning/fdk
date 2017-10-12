package no.dcat.authorization;

import lombok.Data;

@Data
public class OpenDataOrganisasjonsform {
    String kode;
    String beskrivelse;

    public OpenDataOrganisasjonsform() {
        //Default constructur used by frameworks
    }

    public OpenDataOrganisasjonsform(String kode) {
        this.kode = kode;
    }
}
