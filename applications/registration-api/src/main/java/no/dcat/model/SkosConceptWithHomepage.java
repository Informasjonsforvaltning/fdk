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
public class SkosConceptWithHomepage {


    public static  SkosConceptWithHomepage getInstance(String foafHomepage, String prefLabelInNb) {
        SkosConceptWithHomepage skosConceptWithHomepage = new SkosConceptWithHomepage();
        skosConceptWithHomepage.foafHomepage = foafHomepage;
        skosConceptWithHomepage.prefLabel = new HashMap<>();
        skosConceptWithHomepage.prefLabel.put("nb", prefLabelInNb);
        return skosConceptWithHomepage;
    }

    private String foafHomepage = "";

    // internal id
    private String uri = "http://brreg.no/skosConcept/" + UUID.randomUUID().toString();

    private Map<String, String> prefLabel = new HashMap<>();

}
