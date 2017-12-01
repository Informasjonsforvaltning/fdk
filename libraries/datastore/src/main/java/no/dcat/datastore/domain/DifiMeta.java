package no.dcat.datastore.domain;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;

/**
 * Created by havardottestad on 07/01/16.
 */
public class DifiMeta {

	static final String DIFI_META = "http://dcat.difi.no/metadata/";

	public static final Property graph = ResourceFactory.createProperty(DIFI_META + "graph");
	public static final Property url = ResourceFactory.createProperty(DIFI_META + "url");
	public static final Property orgnumber = ResourceFactory.createProperty(DIFI_META + "orgnumber");
	public static final Property dcatSource = ResourceFactory.createProperty(DIFI_META + "dcatSource");
	public static final Resource DcatSource = ResourceFactory.createResource(DIFI_META + "DcatSource");
	public static final Property harvested = ResourceFactory.createProperty(DIFI_META + "harvested");

	public static final Property status = ResourceFactory.createProperty(DIFI_META + "status");

	public static final Resource ok = ResourceFactory.createResource(DIFI_META + "ok");
	public static final Resource warning = ResourceFactory.createResource(DIFI_META + "warning");
	public static final Resource error = ResourceFactory.createResource(DIFI_META + "error");
	public static final Resource syntaxError = ResourceFactory.createResource(DIFI_META + "syntaxError");
	public static final Resource networkError = ResourceFactory.createResource(DIFI_META + "networkError");

	

}
