package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

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

    @Field(type = FieldType.Keyword, store = true)
    @ApiModelProperty("Catalog id is equal to orgNr")
    private String catalogId;

    @Field(type = FieldType.Date, store = true)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern ="yyyy-MM-dd'T'HH:mm:ss.SSSZZ")
    private Date _lastModified;


    @ApiModelProperty("The url of the specification which are used to harvest the specification ")
    private String apiSpecUrl;

    @ApiModelProperty("Original API spec")
    private String apiSpec;

    @ApiModelProperty("The url of the API documentation")
    private String apiDocUrl;

    @ApiModelProperty("The accessRightsCode")
    private String accessRightsCode;

    @ApiModelProperty("Indication if the api is a National Component")
    @Field(type = FieldType.Boolean)
    private boolean nationalComponent;

    @ApiModelProperty("The dataset references")
    private List<String> datasetReferences;

    @ApiModelProperty("Spec converted to openAPI v3")
    private OpenAPI openApi;

    private String cost;

    private String usageLimitation;

    private String performance;

    private String availability;
}
