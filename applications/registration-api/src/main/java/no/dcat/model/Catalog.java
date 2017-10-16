package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import no.dcat.shared.Publisher;
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
public class Catalog extends no.dcat.shared.Catalog {
    public static final String ELASTIC_TYPE = "catalog";

    public Catalog(String orgnr) {
        this.setId(orgnr);
    }

    public Catalog() {
        // Default constructor needed for frameworks
    }

}
