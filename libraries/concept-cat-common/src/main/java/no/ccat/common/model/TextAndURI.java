package no.ccat.common.model;

import lombok.Data;

import java.util.Map;

@Data
public class TextAndURI {
    private Map<String, String> text;
    private String uri;
}
