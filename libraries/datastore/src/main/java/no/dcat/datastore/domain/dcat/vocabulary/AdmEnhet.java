package no.dcat.datastore.domain.dcat.vocabulary;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

public class AdmEnhet {
	
	private static final Model model = ModelFactory.createDefaultModel();
	
	public static final String NS = "http://rdf.kartverket.no/onto/adm_enhet_4.0.owl#";
	
	public static String getURI() {
		return NS;
	}
	
	public static final Resource NAMESPACE = model.createResource(NS);
	
	public static final Property fylkesnavn = model.createProperty(NS, "fylkesnavn");

	public static final Property kommunenavn = model.createProperty(NS, "kommunenavn");
	
	public static final Property nasjonnavn = model.createProperty(NS, "nasjonnavn");

	public static final Resource NamedIndividual = model.createResource("http://www.w3.org/2002/07/owl#NamedIndividual");

}
