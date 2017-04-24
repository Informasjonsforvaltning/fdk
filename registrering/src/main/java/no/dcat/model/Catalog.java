package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;
import java.util.Map;

@Document(indexName = "register", type = Catalog.ELASTIC_TYPE)
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Catalog {
    public static final String ELASTIC_TYPE = "catalog";

    @Id
    private String id;

    private String uri;

    // dct:title
    // Norwegian: Tittel
    private Map<String,String> title;

    //dct:description
    //Norwegian: Beskrivelse
    private Map<String,String> description;

    private Publisher publisher;

    private List<Dataset> dataset;

}
