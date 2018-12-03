package no.ccat.common.model;

import lombok.Data;

import java.util.Map;

@Data
public class Source {
    private String uri;
    private Map<String, String> prefLabel;
}
