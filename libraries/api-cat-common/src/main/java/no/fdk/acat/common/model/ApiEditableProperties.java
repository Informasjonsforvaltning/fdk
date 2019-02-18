package no.fdk.acat.common.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

import java.util.Set;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiEditableProperties {

    @ApiModelProperty("The url of the API documentation")
    private String apiDocUrl;

    @ApiModelProperty("The dataset references")
    private Set<String> datasetUris;

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

    private String statusCode;
}
