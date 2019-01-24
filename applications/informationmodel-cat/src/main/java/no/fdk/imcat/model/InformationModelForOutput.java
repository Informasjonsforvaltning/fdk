package no.fdk.imcat.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.Publisher;

@Data
public class InformationModelForOutput {

    @ApiModelProperty("The id given by the harvest system")
    private String id;

    @ApiModelProperty("The publisher of the information model")
    private Publisher publisher;

    @ApiModelProperty("The source where the record was harvested from")
    private String harvestSourceUri;

    @ApiModelProperty("Information about when the model was first and last harvested by the system")
    private HarvestMetadata harvest;

    @ApiModelProperty("The title of the information model")
    private String title;

    @JsonRawValue
    public String theSchema;
}
