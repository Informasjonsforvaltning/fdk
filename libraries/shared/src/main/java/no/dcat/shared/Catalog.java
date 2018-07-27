package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Catalog {
    private String id;
    private String uri;
    private Map<String, String> title;
    private Map<String, String> description;
    private Publisher publisher;
    private Date issued;
    private Date modified;
    private String language;
    private List<String> themeTaxonomy;
    private List<Dataset> dataset;
}

