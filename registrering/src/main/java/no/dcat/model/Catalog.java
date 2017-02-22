package no.dcat.model;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "register", type = "catalog")
@Data
@ToString(includeFieldNames = false)
public class Catalog {

    private String title;
    private String description;
    private Publisher publisher;


}
