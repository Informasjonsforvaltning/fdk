package no.acat.model;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiCatalogRecord {
    private String orgNr;
    private String orgName;
    private String apiSpecUrl;
    private String apiDocUrl;
    private List<String> accessRightsCodes;
    private String provenanceCode;
    private List<String> datasetReferences;
}
