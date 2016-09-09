package no.difi.dcat.api.web;

import org.apache.jena.rdf.model.Model;

public class DcatNamespaces {
	
	/**
	 * 
	 * @param model
	 * @return
	 */
	public static Model setNsPrefixesOnModel(Model model) {
		model.setNsPrefix("adms", "http://www.w3.org/ns/adms#");
		model.setNsPrefix("dcat", "http://www.w3.org/ns/dcat#");
		model.setNsPrefix("dct", "http://purl.org/dc/terms/");
		model.setNsPrefix("foaf", "http://xmlns.com/foaf/0.1/");
		model.setNsPrefix("owl", "http://www.w3.org/2002/07/owl#");
		model.setNsPrefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
		model.setNsPrefix("schema", "http://schema.org/");
		model.setNsPrefix("skos", "http://www.w3.org/2004/02/skos/core#");
		model.setNsPrefix("spdx", "http://spdx.org/rdf/terms#");
		model.setNsPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
		model.setNsPrefix("vcard", "http://www.w3.org/2006/vcard/ns#");
		
		return model;
	}

}
