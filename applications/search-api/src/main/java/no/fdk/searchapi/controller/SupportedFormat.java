package no.fdk.searchapi.controller;

import org.apache.jena.riot.Lang;

import java.util.Optional;

public enum SupportedFormat {
    JSON_LD("application/ld+json", Lang.JSONLD),
    RDF_XML("application/rdf+xml", Lang.RDFXML),
    TURTLE("text/turtle", Lang.TURTLE);

    private final String accept;
    private final Lang responseFormat;

    SupportedFormat(String accept, Lang responseFormat) {
        this.accept = accept;
        this.responseFormat = responseFormat;
    }


    public static Optional<SupportedFormat> getFormat(String accept) {
        for (SupportedFormat format : values()) {
            if (format.getAccept().equals(accept)) {
                return Optional.of(format);
            }
        }
        return Optional.empty();
    }

    public String getAccept() {
        return accept;
    }

    public Lang getResponseFormat() {
        return responseFormat;
    }
}
