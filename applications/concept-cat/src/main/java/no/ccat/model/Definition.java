package no.ccat.model;

import lombok.Data;

import java.util.Date;
import java.util.Map;

@Data
public class Definition {
    private Map<String, String> text;
    private Map<String, String> remark;
    private Map<String, String> source;
    private String targetGroup; // TODO this is string-enum
    private Date lastUpdated;
}
