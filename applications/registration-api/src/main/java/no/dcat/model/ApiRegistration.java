package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Document(indexName = "reg-api", type = "api")
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRegistration {

    public static final String REGISTRATION_STATUS_DRAFT = "DRAFT";
    public static final String REGISTRATION_STATUS_PUBLISH = "PUBLISH";

    private String registrationStatus = REGISTRATION_STATUS_DRAFT; // DRAFT is default

    @Id
    @ApiModelProperty("Generated id")
    private String id;

    @ApiModelProperty("The orgnr")
    private String orgNr;

    @ApiModelProperty("The url of the specification which are used to harvest the specification ")
    private String apiSpecUrl;

    @ApiModelProperty("Original API spec")
    private String apiSpec;

    @ApiModelProperty("The url of the API documentation")
    private String apiDocUrl;

    @ApiModelProperty("The accessRightsCode")
    private String accessRightsCode;

    @ApiModelProperty("The provenanceCode")
    private String provenanceCode;

    @ApiModelProperty("The datasetReferences")
    private List<String> datasetReferences;

    @ApiModelProperty("Spec converted to openAPI v3")
    private OpenAPI openApi;

    private String price;

    private String trafficLimit;

    private String performance;

    private String reliability;

    private Date lastModified;
}
