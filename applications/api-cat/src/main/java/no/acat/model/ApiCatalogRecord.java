package no.acat.model;

import lombok.Data;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Reference;

import java.util.List;

@Data
public class ApiCatalogRecord {
    private String orgNr;
    private String orgName;
    private String openApiUrl;
    private String docUrl;
    private List<SkosCode> accessRights;
    private List<SkosCode> provenance;
    private List<Reference> datasetReferences;
}
