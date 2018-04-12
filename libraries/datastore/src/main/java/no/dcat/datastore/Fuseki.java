package no.dcat.datastore;

import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.update.UpdateExecutionFactory;
import org.apache.jena.update.UpdateFactory;
import org.apache.jena.update.UpdateProcessor;
import org.apache.jena.update.UpdateRequest;
import org.apache.jena.util.FileManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.Socket;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class Fuseki {

	public static final int FUSEKI_TIMEOUT = 20;
	private String serviceUri;
	private String updateServiceUri;
	private final Logger logger = LoggerFactory.getLogger(Fuseki.class);

	String prefixes = String.join("\n",
			"PREFIX foaf: <http://xmlns.com/foaf/0.1/>",
			"PREFIX difiMeta: <http://dcat.difi.no/metadata/>",
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
			"PREFIX dct: <http://purl.org/dc/terms/>"
	);

	public Fuseki(String serviceUri) {
		logger.info("Endpoint for Fuseki is {}", serviceUri);
		if (serviceUri.endsWith("/")) {
			serviceUri = serviceUri.substring(0, serviceUri.length() - 1);
		}
		this.serviceUri = serviceUri;
		this.updateServiceUri = serviceUri + "/update";
	}

	public void sparqlUpdate(String sparql, Map<String, String> map) {


		ParameterizedSparqlString p = new ParameterizedSparqlString();
		p.setCommandText(prefixes + sparql);
		map.keySet()
				.stream()
				.forEach((key) -> p.setLiteral(key, map.get(key)));

		logger.debug("sparqlUpdate: " + p.toString());
		logger.info("Updating fuseki: {}", updateServiceUri);

		try{

			UpdateExecutionFactory.createRemoteForm(UpdateFactory.create(p.toString()), updateServiceUri).execute();

		}catch (QueryParseException e){
			logger.warn("Error parsing query: p={}", p.toString());
			throw  e;
		}
	}


	public static boolean isReachable(String targetUrl) throws IOException
	{
		HttpURLConnection httpUrlConnection = (HttpURLConnection) new URL(targetUrl).openConnection();
		httpUrlConnection.setRequestMethod("HEAD");

		try
		{
			int responseCode = httpUrlConnection.getResponseCode();

			return responseCode == HttpURLConnection.HTTP_OK;
		} catch (UnknownHostException noInternetConnection)
		{
			return false;
		}
	}

	public ResultSet select(String sparql, Map<String, String> map) {
		ParameterizedSparqlString p = new ParameterizedSparqlString();
		p.setCommandText(prefixes + sparql);
		map.keySet()
				.stream()
				.forEach((key) -> p.setLiteral(key, map.get(key)));

		Query query = QueryFactory.create(p.toString());

		logger.debug("Fuseki:select: {}", query.toString());

		return getQueryExecution(query).execSelect();
	}

	public boolean ask(String query) {
		logger.trace(query);

		QueryExecution q = QueryExecutionFactory.sparqlService(serviceUri,
				prefixes + query);
		q.setTimeout(FUSEKI_TIMEOUT, TimeUnit.SECONDS);

		return q.execAsk();
	}
	
	public boolean ask(String sparql, Map<String, String> map) {
		ParameterizedSparqlString p = new ParameterizedSparqlString();
		p.setCommandText(prefixes + sparql);
		map.keySet()
				.stream()
				.forEach((key) -> p.setLiteral(key, map.get(key)));
		
		Query query = QueryFactory.create(p.toString());
		
		logger.trace(query.toString());

		return getQueryExecution(query).execAsk();

	}

	private QueryExecution getQueryExecution(Query query) {
		QueryExecution q = QueryExecutionFactory.sparqlService(serviceUri,
				query);
		q.setTimeout(FUSEKI_TIMEOUT, TimeUnit.SECONDS);

		return q;
	}

	public void update(String name, Model model) {
		logger.info("Updating graph {} with data", name);

		DatasetAccessor accessor = DatasetAccessorFactory.createHTTP(serviceUri);
		accessor.putModel(name, model);
	}



	public void drop(String name) {
		logger.info("Dropping graph <{}> from "+updateServiceUri, name);
		UpdateRequest request = UpdateFactory.create();
		request.add("DROP GRAPH <" + name + ">");

		UpdateProcessor processor = UpdateExecutionFactory.createRemote(request, updateServiceUri);

		processor.execute();
	}

	public Model construct(String query) {
		logger.trace(query);
		QueryExecution q = QueryExecutionFactory.sparqlService(serviceUri,
				prefixes + query);
		q.setTimeout(FUSEKI_TIMEOUT, TimeUnit.SECONDS);

		Model model = q.execConstruct();

		return model;
	}

	public ResultSet select(String query) {
		logger.trace(query);

		QueryExecution q = QueryExecutionFactory.sparqlService(serviceUri,
				prefixes + query);
		q.setTimeout(FUSEKI_TIMEOUT, TimeUnit.SECONDS);

		ResultSet results = q.execSelect();

		return results;
	}


	public Model describe(String sparql, Map<String, String> map) {

		ParameterizedSparqlString p = new ParameterizedSparqlString();
		p.setCommandText(prefixes + sparql);
		map.keySet()
				.stream()
				.forEach((key) -> p.setLiteral(key, map.get(key)));

		Query query = QueryFactory.create(p.toString());
		logger.debug("describe: {} --> {}", serviceUri, query.toString());

		return getQueryExecution(query).execDescribe();
	}

	public Model graph(String graphName) {

		DatasetAccessor accessor = DatasetAccessorFactory.createHTTP(serviceUri);

		return accessor.getModel(graphName);

	}

	public Model graph() {

		return graph("urn:x-arq:UnionGraph");
	}
}
