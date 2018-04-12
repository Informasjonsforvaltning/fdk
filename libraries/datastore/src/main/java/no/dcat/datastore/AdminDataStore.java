package no.dcat.datastore;

import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.DifiMeta;
import no.dcat.datastore.domain.User;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class AdminDataStore {

	protected final Fuseki fuseki;

	private final Logger logger = LoggerFactory.getLogger(AdminDataStore.class);

	public AdminDataStore(Fuseki fuseki) {
		this.fuseki = fuseki;
	}

	public List<DcatSource> getDcatSourceUrls() {

		ResultSet resultSet = fuseki.select("PREFIX  difiMeta: <http://dcat.difi.no/metadata/>\n" +
				"PREFIX  dct:  <http://purl.org/dc/terms/>\n" +
				"PREFIX  foaf: <http://xmlns.com/foaf/0.1/>\n" +
				"SELECT ?dcatsrc ?url ?org ?user ?graph\n" +
				"WHERE\n" +
				" { \t?user  difiMeta:dcatSource ?dcatsrc.\n" +
				"\t?dcatsrc difiMeta:orgnumber ?org;\n" +
				"\t\tdifiMeta:url ?url;\n" +
				"    \tdifiMeta:graph ?graph.\n" +
				"}");

		List<DcatSource> result = new ArrayList<>();

		while (resultSet.hasNext()) {
			QuerySolution qs = resultSet.next();
			DcatSource dcatSource = new DcatSource();
			dcatSource.setId(qs.get("dcatsrc").asResource().getURI());
			dcatSource.setUrl(qs.get("url").asLiteral().getString());
			dcatSource.setUser(qs.get("user").asResource().getURI());
			dcatSource.setOrgnumber(qs.get("org").asLiteral().getString());
			dcatSource.setGraph(qs.get("graph").asLiteral().getString());

			logger.debug("dcatSource: {}", dcatSource.toString());
			result.add(dcatSource);
		}

		return result;
	}

	/**
	 * @return
	 */
	public List<DcatSource> getDcatSources() {
		logger.debug("Listing all dcat sources");
		List<DcatSource> dcatSources = new ArrayList<>();

		Map<String, String> map = new HashMap<>();

		String query = String.join("\n", "describe ?a ?user where {", "	?user difiMeta:dcatSource ?a.", "}");
		Model dcatModel = fuseki.describe(query, map);

		List<DcatSource> ret = new ArrayList<>();

		ResIterator resIterator = dcatModel.listResourcesWithProperty(RDF.type, DifiMeta.DcatSource);

		while (resIterator.hasNext()) {
			String uri = resIterator.nextResource().getURI();
			ret.add(new DcatSource(dcatModel, uri));
		}

		logger.info("returning {} datasources", ret.size());

		return ret;

	}

	/**
	 * @param username
	 * @return
	 */
	public List<DcatSource> getDcatSourcesForUser(String username) {
		logger.trace("Listing dcat sources for user {}", username);

		Map<String, String> map = new HashMap<>();
		map.put("username", username);

		String query = String.join("\n", "describe ?a ?user where {", "	?user foaf:accountName ?username;",
				"	difiMeta:dcatSource ?a.", "}");
		Model dcatModel = fuseki.describe(query, map);

		if (dcatModel.isEmpty()) {
			return new ArrayList<>();
		}

		StmtIterator stmtIterator = dcatModel.listResourcesWithProperty(FOAF.accountName).next()
				.listProperties(DifiMeta.dcatSource);

		List<DcatSource> dcatSources = new ArrayList<>();

		while (stmtIterator.hasNext()) {
			dcatSources.add(new DcatSource(dcatModel, stmtIterator.nextStatement().getResource().toString()));
		}

		return dcatSources;

	}

	/**
	 * @param dcatSourceId
	 * @return
	 */
	public Optional<DcatSource> getDcatSourceById(String dcatSourceId) {

		logger.trace("Getting dcat source by id {}", dcatSourceId);

		Map<String, String> map = new HashMap<>();
		map.put("dcatSourceId", dcatSourceId);

		String query = String.join("\n", "describe ?a ?user where {", "	BIND(IRI(?dcatSourceId) as ?a)",
				"	?user difiMeta:dcatSource ?a.", "}");
		Model dcatModel = fuseki.describe(query, map);

		logger.debug("{}", DifiMeta.DcatSource);

		if (!dcatModel.listResourcesWithProperty(RDF.type, DifiMeta.DcatSource).hasNext()) {
			logger.debug("EMPTY");
			return Optional.empty();
		}

		logger.debug("{}",new DcatSource(dcatModel, dcatSourceId));

		return Optional.of(new DcatSource(dcatModel, dcatSourceId));
	}


	public Optional<DcatSource> getDcatSourceByGraph(String graphName) {

		logger.trace("Getting dcat source by graph {}", graphName);

		Map<String, String> map = new HashMap<>();
		map.put("graphName", graphName);

		String query = String.join("\n",
				"describe ?a ?user where {",
				"?user difiMeta:dcatSource ?a . ",
				"?a difiMeta:graph ?graphName . ",
				"}"
		);
		Model dcatModel = fuseki.describe(query, map);

		if (!dcatModel.listResourcesWithProperty(RDF.type, DifiMeta.DcatSource).hasNext()) {
			return Optional.empty();
		}

		String id = dcatModel.listResourcesWithProperty(RDF.type, DifiMeta.DcatSource).nextResource().getURI();

		return Optional.of(new DcatSource(dcatModel, id));
	}

	/**
	 * @param dcatSource
	 */
	public DcatSource addDcatSource(DcatSource dcatSource) {
		boolean update = false;

		if (dcatSource.getId() != null && dcatSource.getGraph() == null) {
			// get current graph
			Optional<DcatSource> dcatSourceById = getDcatSourceById(dcatSource.getId());
			if (dcatSourceById.isPresent()) {
				// only need to check if graph requires update
				dcatSource.setGraph(dcatSourceById.get().getGraph());
				logger.info("[crawler_admin] [success] Updated DCAT source: {}", dcatSource.toString());
				update = true;
			}

		}

		if (dcatSource.getId() == null && dcatSource.getGraph() != null) {
			throw new UnsupportedOperationException(
					"dcatSource id can not  ==null while the graph is != null. This is potentially dangerous behaviour.");
		}

		if (dcatSource.getUser() == null) {
			throw new UnsupportedOperationException("Not allowed to add a dcatSource without a user");

		}

		if (dcatSource.getId() == null || dcatSource.getId().isEmpty()) {
			dcatSource.setId("http://dcat.difi.no/dcatSource_" + UUID.randomUUID().toString());
		}
		if (dcatSource.getGraph() == null) {
			dcatSource.setGraph("http://dcat.difi.no/dcatSource_" + UUID.randomUUID().toString());
		}

		String insertOrgnumber = "";
		if (dcatSource.getOrgnumber() != null) {
			insertOrgnumber = "                             difiMeta:orgnumber ?orgnumber;";
		}

		String query = String.join("\n",
				"delete {",
				"	graph <http://dcat.difi.no/usersGraph/> {",
				"		?dcatSource difiMeta:graph  ?originalDcatGraphUri. ",
				"		?dcatSource difiMeta:url  ?originalUrl.",
				"		?dcatSource difiMeta:orgnumber  ?originalOrgnumber. ",
				"		?dcatSource rdfs:comment  ?originalDescription. ",
				"	}",
				"}",
				"insert {",
				"     graph <http://dcat.difi.no/usersGraph/> {",
				"          ?user difiMeta:dcatSource ?dcatSource .",
				"          ?dcatSource a difiMeta:DcatSource ; ",
				"                             difiMeta:graph ?dcatGraphUri; ",
				"                             difiMeta:url ?url;",
				insertOrgnumber,
				"					rdfs:comment ?description",
				"",
				"",
				" . ",
				"     }",
				"} where {",
				"           BIND(IRI(?dcatSourceUri) as ?dcatSource)",
				"           ?user foaf:accountName ?username",
				"		OPTIONAL{ ?dcatSource difiMeta:graph  ?originalDcatGraphUri} ",
				"		OPTIONAL{ ?dcatSource difiMeta:url  ?originalUrl} ",
				"		OPTIONAL{ ?dcatSource difiMeta:orgnumber  ?originalOrgnumber} ",
				"		OPTIONAL{ ?dcatSource rdfs:comment  ?originalDescription} ",
				"}");


		Map<String, String> map = new HashMap<>();

		map.put("username", dcatSource.getUser());
		map.put("dcatSourceUri", dcatSource.getId());
		map.put("dcatGraphUri", dcatSource.getGraph());
		map.put("description", dcatSource.getDescription());

		if (dcatSource.getOrgnumber() != null) {
			map.put("orgnumber", dcatSource.getOrgnumber());
		}

		map.put("url", dcatSource.getUrl());

		// Create data source graph
		fuseki.sparqlUpdate(query, map);

		if (!update) {
			if (fuseki.ask("ask { ?dcatSourceUri foaf:accountName ?dcatSourceUri}", map)) {
				logger.error("[crawler_admin] [fail] Error adding DCAT source: {}", dcatSource.toString());
			} else {
				logger.info("[crawler_admin] [success] Added DCAT source: {}", dcatSource.toString());
			}
		}

		if (fuseki.ask("ask { ?a ?b <" + dcatSource.getId() + ">}")) {
			return dcatSource;
		} else {
			// @TODO throw exception?
			return null;
		}

	}

	/**
	 * @param user
	 */
	public User addUser(User user) throws UserAlreadyExistsException {

		if (user.getId() == null || user.getId().isEmpty()) {
			// insert new user
			user.setId("http://dcat.difi.no/user_" + UUID.randomUUID().toString());

			String query = String.join("\n", "insert {", "     graph <http://dcat.difi.no/usersGraph/> {",
					"           <" + user.getId() + "> foaf:accountName ?username;",
					"                               difiMeta:role ?role;",
					"                               difiMeta:email ?email;",
					"                               difiMeta:password ?password;",
					"                               a difiMeta:User;", "            .", "     }", "} where {",
					"     FILTER(!EXISTS{?a foaf:accountName ?username. })", "}");

			Map<String, String> map = new HashMap<>();
			map.put("username", user.getUsername());
			map.put("role", user.getRole());
			map.put("password", user.getPassword());
			map.put("email", user.getEmail());

			if (fuseki.ask("ask { ?user foaf:accountName ?username}", map)) {
				throw new UserAlreadyExistsException(user.getUsername());
			} else {
				logger.info("[user_admin] [success] Added user: {}", user.toString());
				fuseki.sparqlUpdate(query, map);
			}

		} else {
			// update exisiting user

			// get password if not exists
			if (user.getPassword() == null || user.getPassword().isEmpty()) {
				String getPasswordQuery = "select * where {BIND(IRI(?userId) as ?user). ?user difiMeta:password ?password. }";
				Map<String, String> map = new HashMap<>();
				map.put("userId", user.getId());
				ResultSet select = fuseki.select(getPasswordQuery, map);
				if (select.hasNext()) {
					String password = select.next().getLiteral("password").getString();
					user.setPassword(password);
				} else {
					throw new RuntimeException("No such user: " + user.getId() + " " + user.getUsername());
				}
			}

			String query = String.join("\n", "delete{", "     graph <http://dcat.difi.no/usersGraph/> {",
					"           ?user foaf:accountName ?original_username;",
					"                               difiMeta:role ?original_role;",
					"                               difiMeta:email ?original_email;",
					"                               difiMeta:password ?original_password;",
					"                               a difiMeta:User;", "            .", "	}", "}insert {",
					"     graph <http://dcat.difi.no/usersGraph/> {", "           ?user foaf:accountName ?username;",
					"                               difiMeta:role ?role;",
					"                               difiMeta:email ?email;",
					"                               difiMeta:password ?password;"
							+ "                               a difiMeta:User;",
					"            .", "     }", "} where {", "	BIND(IRI(?userId) as ?user).",
					"           ?user foaf:accountName ?original_username;",
					"                               difiMeta:role ?original_role;",
					"                               difiMeta:email ?original_email;",
					"                               difiMeta:password ?original_password;",
					"                               a difiMeta:User;", "}");

			Map<String, String> map = new HashMap<>();
			map.put("username", user.getUsername());
			map.put("role", user.getRole());
			map.put("password", user.getPassword());
			map.put("email", user.getEmail());
			map.put("userId", user.getId());

			fuseki.sparqlUpdate(query, map);
			logger.info("[user_admin] [success] Updated user: {}", user.toString());

		}

		if (fuseki.ask("ask { <" + user.getId() + "> ?b ?c}")) {
			return user;
		} else {
			logger.error("[user_admin] [fail] Error adding user: {}", user.toString());
		}
		return null;
	}

	/**
	 * @param username
	 */
	public void deleteUser(String username) {
		// @TODO Use SPARQL update instead

		// throw exception if the user has a dcatSource.

		String user = String.format("http://dcat.difi.no/%s", username);
		fuseki.drop(user);
	}

	public List<User> getUsers() {
		Map<String, String> map = new HashMap<>();
		String query = String.join("\n", "select ?userid ?username ?password ?email ?role where {",
				"     ?userid foaf:accountName ?username ;", "           difiMeta:password ?password ;",
				"			difiMeta:email ?email ;", "           difiMeta:role ?role ;", ".", "}");
		ResultSet results = fuseki.select(query, map);

		List<User> users = new ArrayList<>();
		while (results.hasNext()) {
			users.add(User.fromQuerySolution(results.next()));
		}

		return users;
	}

	/**
	 * @param username
	 * @return
	 * @throws UserNotFoundException
	 */
	public Map<String, String> getUser(String username) throws UserNotFoundException {
		logger.trace("Getting user {}", username);

		Map<String, String> map = new HashMap<>();
		map.put("username", username);
		String query = String.join("\n", "select ?password ?role where {", "     ?user foaf:accountName ?username ;",
				"           difiMeta:password ?password ;", "           difiMeta:role ?role ;", ".", "}");
		ResultSet results = fuseki.select(query, map);

		Map<String, String> userMap = new HashMap<>();
		while (results.hasNext()) {
			QuerySolution qs = results.next();
			userMap.put("username", username);
			userMap.put("password", qs.get("password").asLiteral().toString());
			userMap.put("role", qs.get("role").asLiteral().toString());
		}

		if (!userMap.containsKey("username")) {
			throw new UserNotFoundException("User not found in database: " + username);
		}

		return userMap;
	}

	public void addCrawlResults(DcatSource dcatSource, Resource status, String message) {

		logger.trace("Adding crawl result to dcat source {}", dcatSource.getId());
		Map<String, String> map = new HashMap<>();

		String sparqlMessage = "";
		if (message != null) {
			sparqlMessage = "rdfs:comment ?message;";

			// max 250 characters TODO XXX - parameterize
			String croppedMessage =  message.length() < 250 ? message : message.substring(0, 250);
			map.put("message", croppedMessage);
		}

		String query = String.join("\n", "insert {", "     graph <http://dcat.difi.no/usersGraph/> {",
				"           <" + dcatSource.getId() + "> difiMeta:harvested [", "			a difiMeta:Harvest;",
				"			dct:created ?dateCreated;", "			difiMeta:status <" + status.getURI() + ">;",
				sparqlMessage, "			", "            ].", "     }", "} where {",
				"     BIND(NOW() as ?dateCreated)", "}");

		fuseki.sparqlUpdate(query, map);
	}

	public User getUserObject(String username) throws UserNotFoundException {
		Map<String, String> userMap = getUser(username);
		return new User("", userMap.get("username"), "", "", userMap.get("role"));
	}
}