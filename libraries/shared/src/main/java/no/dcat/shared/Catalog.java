package no.dcat.shared;

import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
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
}

