package no.fdk.registration.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import no.fdk.acat.common.model.apispecification.ApiSpecification;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRegistrationEditableProperties {

    public static final String REGISTRATION_STATUS_DRAFT = "DRAFT";
    public static final String REGISTRATION_STATUS_PUBLISH = "PUBLISH";

    private String registrationStatus;

    @ApiModelProperty("The url of the specification which are used to harvest the specification ")
    private String apiSpecUrl;

    @ApiModelProperty("Original API spec")
    private String apiSpec;

    @ApiModelProperty("The url of the API documentation")
    private String apiDocUrl;

    @ApiModelProperty("The dataset references")
    private List<String> datasetReferences;

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
