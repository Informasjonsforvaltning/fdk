package no.dcat.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.HashMap;

@Document(indexName = "register", type = Catalog.ELASTIC_TYPE)
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Catalog extends no.dcat.shared.Catalog {
    public static final String ELASTIC_TYPE = "catalog";

    public Catalog(String orgnr) {
        setTitle(new HashMap<>());
        setDescription(new HashMap<>());
        this.setId(orgnr);
    }

    public Catalog() {
        // Default constructor needed for frameworks
        setTitle(new HashMap<>());
        setDescription(new HashMap<>());
    }
}
