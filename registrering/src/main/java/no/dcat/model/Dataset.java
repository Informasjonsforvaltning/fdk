package no.dcat.model;

import lombok.Data;
import lombok.NonNull;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;

@Document(indexName = "register", type = "dataset")
@Data
@ToString(includeFieldNames = false)
public class Dataset {

    @Id
    @NonNull
    private String id;

    @Field
    private String description;


}
