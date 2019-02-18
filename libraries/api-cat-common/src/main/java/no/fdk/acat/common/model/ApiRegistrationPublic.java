package no.fdk.acat.common.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;
import no.fdk.acat.common.model.apispecification.ApiSpecification;

import java.util.Set;

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

    @ApiModelProperty("The dataset references")
    private Set<String> datasetUris;

    private ApiSpecification apiSpecification;

    @ApiModelProperty("Indication if the api is from an authoritative source (a National Component)")
    private Boolean nationalComponent;

    @ApiModelProperty("Indication if the api has open access")
    private Boolean isOpenAccess;

    @ApiModelProperty("Indication if the api has open licence")
    private Boolean isOpenLicense;

    @ApiModelProperty("Indication if the api is free")
    private Boolean isFree;

    private String cost;

    private String usageLimitation;

    private String performance;

    private String availability;

    private String status;
}
