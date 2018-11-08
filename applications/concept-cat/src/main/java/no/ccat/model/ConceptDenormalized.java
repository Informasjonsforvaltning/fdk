package no.ccat.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.Publisher;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;
import org.springframework.hateoas.core.Relation;

import java.util.List;
import java.util.Map;

@Data
@Relation(value = "concept", collectionRelation = "concepts")
@Document(indexName = "ccat", type = "concept")
@Setting(settingPath = "ccat.settings.json")
@Mapping(mappingPath = "conceptdenormalized.mapping.json")
public class ConceptDenormalized {
    @ApiModelProperty("The id given by the harvest system")
    private String id;

    @ApiModelProperty("The uri of the concept [dct:identifier]")
    private String uri;

    @ApiModelProperty("The source where the record was harvested from")
    private String harvestSourceUri;

    @ApiModelProperty("information about when the concept was first and last harvested by the system")
    private HarvestMetadata harvest;

    @ApiModelProperty("The publisher of the concept [dct:publisher]")
    private Publisher publisher;

    @ApiModelProperty("identifiers")
    private List<String> identifiers;

    @ApiModelProperty("The definition [skosno:Definisjon]")
    private Definition definition;

    @ApiModelProperty("The alternative definition [skosno:Definisjon]")
    private Definition alternativeDefinition;

    @ApiModelProperty("Subject [dct:subject]")
    private Map<String, String> subject;

    @ApiModelProperty("Preferred labels [skosxl:prefLabel]")
    private Map<String, String> prefLabel;

    @ApiModelProperty("Alternative labels [skos:altLabel]")
    private List<Map<String, String>> altLabel;

    @ApiModelProperty("Hidden labels [skos:hiddenLabel]")
    private List<Map<String, String>> hiddenLabel;
}
