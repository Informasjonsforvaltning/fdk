package no.ccat.model;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import no.dcat.shared.*;

import java.util.Arrays;
import java.util.Date;

public class ConceptDenormalizedFactory {
    public static ConceptDenormalized create(String id) {
        ConceptDenormalized concept = new ConceptDenormalized();
        concept.setId(id);
        concept.setUri("testuri" + id);
        concept.setHarvestSourceUri("testharvestsourceuri"+id);

        HarvestMetadata harvest = HarvestMetadataUtil.createOrUpdate(null, new Date(), false);
        concept.setHarvest(harvest);

        Publisher publisher = new Publisher();
        publisher.setOrgPath("/ba/be/bi/"+id);
        publisher.setId("idid");
        publisher.setPrefLabel(ImmutableMap.of("no", "norsk pub preflabel"+id, "en", "engelsk pub preflabel"+id));
        concept.setPublisher(publisher);

        Definition definition = new Definition();
        definition.setText(ImmutableMap.of("no", "norsk definitin"+id, "en", "engelsk definition"+id));

        SkosConcept source = SkosConcept.getInstance("http://www.ee", "norsk label til url"+id);
        String refTypeJson = "{\n" +
            "            \"uri\": \"dct:source\",\n" +
            "            \"code\": \"source\",\n" +
            "            \"prefLabel\": {\n" +
            "            \"en\": \"Source\",\n" +
            "                \"nn\": \"Er avleda frå\",\n" +
            "                \"nb\": \"Er avledet fra\"\n" +
            "        }}";
        SkosCode refType = new Gson().fromJson(refTypeJson, SkosCode.class);
        Reference sourceRef = new Reference(refType, source);
        definition.setSources(Arrays.asList(sourceRef));

        concept.setDefinition(definition);

        concept.setPrefLabel(ImmutableMap.of("no", "norsk preflabel"+id, "en", "engelsk preflabel"+id));

        return concept;
    }
}
