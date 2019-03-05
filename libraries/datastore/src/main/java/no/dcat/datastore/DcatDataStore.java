package no.dcat.datastore;

import java.util.ArrayList;
import java.util.List;

import no.dcat.datastore.domain.DcatSource;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DcatDataStore {

	private final Fuseki fuseki;
	private final Logger logger = LoggerFactory.getLogger(DcatDataStore.class);

	public DcatDataStore(Fuseki fuseki) {
		this.fuseki = fuseki;
	}

	/**
	 * Save a data catalogue, replacing existing data catalogues with the same name
	 * @param dcatSource
	 * @param dcatModel
	 */
	public void saveDataCatalogue(DcatSource dcatSource, Model dcatModel) {
		dcatModel.setNsPrefix("adms", "http://www.w3.org/ns/adms#");
		dcatModel.setNsPrefix("dcat", "http://www.w3.org/ns/dcat#");
        dcatModel.setNsPrefix("dcatapi", "http://dcat.no/dcatapi/");
		dcatModel.setNsPrefix("dct", "http://purl.org/dc/terms/");
		dcatModel.setNsPrefix("foaf", "http://xmlns.com/foaf/0.1/");
		dcatModel.setNsPrefix("owl", "http://www.w3.org/2002/07/owl#");
		dcatModel.setNsPrefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
		dcatModel.setNsPrefix("schema", "http://schema.org/");
		dcatModel.setNsPrefix("skos", "http://www.w3.org/2004/02/skos/core#");
		dcatModel.setNsPrefix("spdx", "http://spdx.org/rdf/terms#");
		dcatModel.setNsPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
		dcatModel.setNsPrefix("vcard", "http://www.w3.org/2006/vcard/ns#");

		logger.info("Adding data catalogue {}", dcatSource.getGraph());
		fuseki.drop(dcatSource.getGraph());
		fuseki.update(dcatSource.getGraph(), dcatModel);
	}

	public Model getAllDataCatalogues() {
		logger.trace("Getting all data catalogues");
		Model model = fuseki.graph();
		return model;
	}

	public void deleteDataCatalogue(DcatSource dcatSource) {
		if(dcatSource == null || dcatSource.getGraph() == null || dcatSource.getGraph().trim().equals("")) return;
		fuseki.drop(dcatSource.getGraph());
	}

	public Model getDataCatalogue(String graphName) {
		logger.trace("Getting all catalogue in graph {}", graphName);
		Model model = fuseki.graph(graphName);
		return model;
	}

	public List<String> listGraphs() {
		logger.trace("Listing all graphs");
		String query = String.join("",
			"select distinct ?g where {",
				"graph ?g  {",
				"?a ?b ?c.",
				"}",
			"}"	);

		List<String> graphs = new ArrayList<>();

		ResultSet results = fuseki.select(query);
		while (results.hasNext()) {
			QuerySolution next = results.next();
			graphs.add(next.get("g").asResource().getURI());
		}
		return graphs;

	}
}
