package no.ccat.model;

import lombok.Data;
import no.dcat.shared.Reference;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
public class Definition {
    private Map<String, String> text;
    private Map<String, String> remarks;
    private List<Reference> sources;
    private String targetGroup; // TODO this is string-enum
    private Date lastUpdated;
}
