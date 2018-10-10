package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.hateoas.core.Relation;

import java.util.Date;
import java.util.HashMap;

@Document(indexName = "register", type = ApiSpecification.ELASTIC_TYPE)
@Data
@Relation(collectionRelation = "apispecs")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiSpecification extends no.dcat.shared.ApiSpecification {
  public static final String ELASTIC_TYPE = "apispec";

  public static final String REGISTRATION_STATUS_DRAFT = "DRAFT";
  public static final String REGISTRATION_STATUS_PUBLISH = "PUBLISH";

  // Can't specify parent if no parent field has been configured
  @Field(type = FieldType.Keyword, store = true)
  private String catalogId;

  // Can't specify parent if no parent field has been configured
  @Field(type = FieldType.Keyword, store = true)
  private String apispecId;

  // Meta information about editiong of the dataset description
  @Field
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZZ")
  private Date _lastModified;

  @Field private String registrationStatus = REGISTRATION_STATUS_DRAFT; // DRAFT is default

  public ApiSpecification(String orgnr) {
    this();
    this.setId(orgnr);
  }

  public ApiSpecification() {
    this.setTitle(new HashMap<>());
    this.setDescription(new HashMap<>());
    // Default constructor needed for frameworks
  }
}
