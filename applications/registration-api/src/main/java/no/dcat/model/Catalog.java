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
        this.setId(orgnr);
    }

    public Catalog() {
        // Default constructor needed for frameworks
    }

    public void addTitle(String language, String title) {
        if (this.getTitle() == null) {
            this.setTitle(new HashMap<>());
        }
        this.getTitle().put(language, title);
    }
}
