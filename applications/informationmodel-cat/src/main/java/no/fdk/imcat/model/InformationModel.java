package no.fdk.imcat.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import no.ccat.common.model.Concept;
import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.Publisher;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;
import org.springframework.hateoas.core.Relation;

@Data
@EqualsAndHashCode(callSuper = true)
@Relation(value = "informationmodel", collectionRelation = "informationmodels")
@Document(indexName = "imcat", type = "informationmodel")
@Setting(settingPath = "imcat.settings.json")
@Mapping(mappingPath = "informationmodel.mapping.json")
public class InformationModel extends Concept {

    @ApiModelProperty("The publisher of the information model")
    private Publisher publisher;

    @ApiModelProperty("The source where the record was harvested from")
    private String harvestSourceUri;

    @ApiModelProperty("Information about when the model was first and last harvested by the system")
    private HarvestMetadata harvest;

    @ApiModelProperty("The title of the information model")
    private String title;

    @ApiModelProperty("The model itself, expressed in JSON-SCHEMA")
    private String schema;//TODO: Find better name

}
