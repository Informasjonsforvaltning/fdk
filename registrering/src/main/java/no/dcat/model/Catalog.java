package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.ArrayList;
import java.util.HashMap;
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

    // dct:title
    // Norwegian: Tittel
    private Map<String,String> title = new HashMap<>();

    //dct:description
    //Norwegian: Beskrivelse
    private Map<String,String> description = new HashMap<>();

    private Publisher publisher;

    private List<Dataset> dataset = new ArrayList<>();



}
