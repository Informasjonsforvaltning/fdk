package no.dcat.shared;

import lombok.Data;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@ToString(includeFieldNames = false)
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkosConcept {

    private String uri; // = "http://brreg.no/skosConcept/" + UUID.randomUUID().toString();
    private Map<String, String> prefLabel;
    private String extraType;

    public static SkosConcept getInstance(String sourceUrl) {
        SkosConcept skosConcept = new SkosConcept();

        skosConcept.uri = sourceUrl;

        return skosConcept;
    }


    public static SkosConcept getInstance(String sourceUrl, Map<String,String> prefLabel) {
        SkosConcept skosConcept = new SkosConcept();
        skosConcept.uri = sourceUrl;
        skosConcept.prefLabel = prefLabel;

        return skosConcept;
    }

    public static SkosConcept getInstance(String sourceUrl, String prefLabelInNb, String extraType) {
        SkosConcept skosConcept = new SkosConcept();
        skosConcept.uri = sourceUrl;
        skosConcept.prefLabel = new HashMap<String,String>();
        skosConcept.prefLabel.put("nb", prefLabelInNb);
        skosConcept.extraType = extraType;
        return skosConcept;
    }

    public static SkosConcept getInstance(String sourceUrl, String prefLabelInNb) {
        if (sourceUrl == null || sourceUrl.isEmpty()) {
            return null;
        }

        SkosConcept skosConcept = new SkosConcept();

        skosConcept.uri = sourceUrl;
        if (prefLabelInNb != null && !prefLabelInNb.isEmpty()) {
            skosConcept.prefLabel = new HashMap<String,String>();
            skosConcept.prefLabel.put("nb", prefLabelInNb);
        }
        skosConcept.extraType = null;
        return skosConcept;
    }
}
