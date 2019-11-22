package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.hateoas.core.Relation;

import java.util.Date;
import java.util.HashMap;

@Document(indexName = "register", type = Dataset.ELASTIC_TYPE)
@Data
@EqualsAndHashCode(callSuper = true)
@Relation(collectionRelation = "datasets")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Dataset extends no.dcat.shared.Dataset {

    public static final String ELASTIC_TYPE = "dataset";

    public static final String REGISTRATION_STATUS_DRAFT = "DRAFT";
    public static final String REGISTRATION_STATUS_PUBLISH = "PUBLISH";

    @Field(type = FieldType.Keyword, store = true)
    private String catalogId;

    @Field(type = FieldType.Date, store = true)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern ="yyyy-MM-dd'T'HH:mm:ss.SSSZZ")
    private Date _lastModified;

    @Field
    private String registrationStatus;

    public Dataset() {
        super();
    }

    public Dataset(String id) {
        this.setId(id);
    }

    @Override
    public String toString() {
        String first = super.toString() ;

        return first.substring(0, first.length()-1) +", " + catalogId + ", " + _lastModified + ", " + registrationStatus + ")";
    }
}
