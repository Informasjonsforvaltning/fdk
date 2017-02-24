package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;

import java.util.Map;

@Document(indexName = "register", type = "catalog")
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Catalog {

    @Id
    private String id;

    // dct:title
    // Norwegian: Tittel
    @Field
    private Map<String,String> title;

    //dct:description
    //Norwegian: Beskrivelse
    @Field
    private Map<String,String> description;

    private Publisher publisher;


}
