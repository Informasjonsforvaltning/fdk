package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.v3.oas.models.OpenAPI;
import lombok.*;
import no.dcat.shared.Publisher;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;

import java.util.*;

@Document (indexName = "register", type = Catalog.ELASTIC_TYPE)
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRegistration {
  
  public static final String ELASTIC_TYPE = "registration";
  
  public static final String REGISTRATION_STATUS_DRAFT = "DRAFT";
  public static final String REGISTRATION_STATUS_PUBLISH = "PUBLISH";

  @Field private String registrationStatus = REGISTRATION_STATUS_DRAFT; // DRAFT is default

  /** Fields from CSV */
  @ApiModelProperty("The orgnr")
  private String orgNr;

  @ApiModelProperty("The id given to the object by the harvest system")
  private String id;
  
  @ApiModelProperty("the title of the api, can be specified in multiple langauges [dct:title]")
  private Map<String, String> title;
  
  @ApiModelProperty("the description of the api, can be specified in multiple languages [dct:description]")
  private Map<String, String> description;
  
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

  // Meta information about editiong of the dataset description
  @Field
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZZ")
  private Date lastModified;

  @ApiModelProperty("The publisher of the api [dct:publisher]")
  private Publisher publisher;
  
  
  public ApiRegistration(String orgnr) {
    this();
    this.setId(UUID.randomUUID().toString());
  }
  
  public ApiRegistration() {
    this.setTitle(new HashMap<>());
    this.setDescription(new HashMap<>());
    // Default constructor needed for frameworks
  }
}
