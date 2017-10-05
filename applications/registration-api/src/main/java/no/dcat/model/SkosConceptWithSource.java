package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkosConceptWithSource {


    public static SkosConceptWithSource getInstance(String sourceUrl, String prefLabelInNb, String extraType) {
        SkosConceptWithSource skosConceptWithHomepage = new SkosConceptWithSource();
        skosConceptWithHomepage.source = sourceUrl;
        skosConceptWithHomepage.prefLabel.put("nb", prefLabelInNb);
        skosConceptWithHomepage.extraType = extraType;
        return skosConceptWithHomepage;
    }

    private String extraType;

    private String source = "";

    // internal id
    private String uri = "http://brreg.no/skosConcept/" + UUID.randomUUID().toString();

    private Map<String, String> prefLabel = new HashMap<>();

}
