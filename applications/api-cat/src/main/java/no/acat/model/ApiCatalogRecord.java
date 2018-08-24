package no.acat.model;

import lombok.Data;

import java.util.List;

@Data
public class ApiCatalogRecord {
    private String orgNr;
    private String orgName;
    private String openApiUrl;
    private String docUrl;
    private List<String> accessRightsCodes;
    private String provenanceCode;
    private List<String> datasetReferences;
}
