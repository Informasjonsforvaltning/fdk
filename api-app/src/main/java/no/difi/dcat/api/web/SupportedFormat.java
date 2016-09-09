package no.difi.dcat.api.web;

import org.springframework.http.MediaType;

public enum SupportedFormat {

	JSONLD("application/ld+json", "JSONLD"),
	RDFXML("application/rdf+xml", "RDF/XML");
	
	private final MediaType mimetype;
	private final String lang;
	
	private SupportedFormat(String mimetype, String lang) {
		this.mimetype = MediaType.parseMediaType(mimetype);
		this.lang = lang;
	}
	
	public MediaType getMimetype() {
		return mimetype;
	}

	public String getLang() {
		return lang;
	}

	public static SupportedFormat parseFormat(String format) {
		if (format == null) {
			return JSONLD;
		}
		
		format = format.replace("/", "");
		
		if (format.equalsIgnoreCase(RDFXML.toString())) {
			return RDFXML;
		} else {
			return JSONLD;
		}
	}
	
}
