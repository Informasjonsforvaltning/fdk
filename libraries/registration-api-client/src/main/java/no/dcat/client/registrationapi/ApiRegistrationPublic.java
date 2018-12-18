package no.dcat.client.registrationapi;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRegistrationPublic {

    private String id;

    @ApiModelProperty("Catalog id is equal to orgNr")
    private String catalogId;

    @ApiModelProperty("The url of the specification which are used to harvest the specification ")
    private String apiSpecUrl;

    @ApiModelProperty("Original API spec")
    private String apiSpec;

    @ApiModelProperty("The url of the API documentation")
    private String apiDocUrl;

    @ApiModelProperty("Indication if the api is a National Component")
    private boolean nationalComponent;

    @ApiModelProperty("The dataset references")
    private List<String> datasetReferences;

    @ApiModelProperty("Spec converted to openAPI v3")
    private OpenAPI openApi;

    @ApiModelProperty("True ff this Api has been harvested from an Api Catalog")
    private boolean isFromApiCatalog;

    private String cost;

    private String usageLimitation;

    private String performance;

    private String availability;
}
