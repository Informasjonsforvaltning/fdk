package no.dcat.datastore.domain;

import org.apache.jena.query.QuerySolution;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDFS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class DcatSource {

	private static Logger logger = LoggerFactory.getLogger(DcatSource.class);

	private String id;
	private String description;
	private String url;
	private String user;
	private String graph;
	private String orgnumber;

	private List<Harvest> harvested = new ArrayList<>();

	public DcatSource(Model dcatModel, String id) {
		Resource resource = dcatModel.getResource(id);

		this.id = id;

		url = extractExactlyOneString(resource, DifiMeta.url);
		graph = extractExactlyOneString(resource, DifiMeta.graph);
		description = extractExactlyOneString(resource, RDFS.comment);

		user = dcatModel
				.listStatements(null, DifiMeta.dcatSource, resource) //list statements that are the user object for this dcat source
				.next()
				.getSubject()
				.listProperties(FOAF.accountName)
				.next()
				.getString();


		orgnumber = extractExactlyOneStringOrNull(resource, DifiMeta.orgnumber);

		StmtIterator harvestedIterator = resource.listProperties(DifiMeta.harvested);
		while (harvestedIterator.hasNext()) {
			Statement next = harvestedIterator.next();
			Resource resource1 = next.getObject().asResource();
			String s = extractExactlyOneString(resource1, DCTerms.created);
			harvested.add(new Harvest(extractExactlyOneResource(resource1, DifiMeta.status), s,
					extractExactlyOneStringOrNull(resource1, RDFS.comment)));

		}

	}

	String extractExactlyOneString(Resource resource, Property p) {
		StmtIterator stmtIterator = resource.listProperties(p);
		String ret;
		try {
			ret = stmtIterator.next().getString();
		} catch (NoSuchElementException e) {
			throw new NoSuchElementException("Tried to access " + p.getURI());
		}
		if (stmtIterator.hasNext()) {
			throw new RuntimeException("Model contains more than one string for property " + p.toString());
		}
		return ret;
	}

	String extractExactlyOneStringOrNull(Resource resource, Property p) {
		StmtIterator stmtIterator = resource.listProperties(p);
		String ret;
		try {
			ret = stmtIterator.next().getString();
		} catch (NoSuchElementException e) {
			return null;
		}
		if (stmtIterator.hasNext()) {
			throw new RuntimeException("Model contains more than one string for property " + p.toString());
		}
		return ret;
	}

	Resource extractExactlyOneResource(Resource resource, Property p) {
		StmtIterator stmtIterator = resource.listProperties(p);
		Resource ret;
		try {
			ret = stmtIterator.next().getResource();
		} catch (NoSuchElementException e) {
			throw new NoSuchElementException("Tried to access " + p.getURI());
		}
		if (stmtIterator.hasNext()) {
			throw new RuntimeException("Model contains more than one string for property " + p.toString());
		}
		return ret;
	}

	public DcatSource() {
	}

	public DcatSource(String id, String description, String url, String user, String orgnumber) {
		this.id = id;
		this.description = description;
		this.url = url;
		this.user = user;
		this.orgnumber = orgnumber;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getId() {
		return id;
	}

	public String getIdUrlEncoded() {
		try {
			return URLEncoder.encode(id, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			logger.error("URL wrong Encoding",e);
		}
		return "";
	}


	public String getUrl() {
		return url;
	}

	public String getUser() {
		return user;
	}

	public void setOrgnumber(String orgnumber) {
		this.orgnumber = orgnumber;

	}

	public String getOrgnumber() {
		return orgnumber;
	}

	public static DcatSource fromQuerySolution(QuerySolution qs) {
		return new DcatSource(qs.get("name").asResource().getURI(), qs.get("description").asLiteral().getString(),
				qs.get("url").asResource().getURI(), qs.get("user").asLiteral().getString(), qs.get("orgnumber").asLiteral().getString());
	}

	public static DcatSource getDefault() {
		return new DcatSource(String.format("http://dcat.difi.no/%s", UUID.randomUUID().toString()), "Npolar",
				"http://api.npolar.no/dataset/?q=&format=json&variant=dcat&limit=all&filter-links.rel=data&filter-draft=no",
				"test", "123456789");
	}

	public String toString() {
		return String.format("crawler_id=%1$s, crawler_name=%2$s, crawler_url=%3$s, crawler_user=%4$s", this.getId(), this.getDescription(), this.getUrl(), this.getUser());
	}
	
	public String getGraph() {
		return graph;
	}

	public void setGraph(String graph) {
		this.graph = graph;
	}

	public List<Harvest> getHarvested() {
		return harvested;
	}

	public List<Harvest> getHarvestedLast100() {

		return harvested.stream().sorted().limit(100).collect(Collectors.toList());
	}

	public Optional<Harvest> getLastHarvest() {
		Optional<Harvest> harvest = harvested.stream().sorted().findFirst();
		return harvest;
	}

	public class Harvest  implements Comparable<Harvest>{
		private Resource status;
		private String createdDate;
		private String message;

		public Harvest(Resource status, String createdDate, String message) {
			this.status = status;
			this.createdDate = createdDate;
			this.message = message;
		}

		public String getCreatedDateFormatted() {
			OffsetDateTime parse = OffsetDateTime.parse(createdDate);
			ZonedDateTime zonedDateTime = parse.atZoneSameInstant(ZoneId.of("Europe/Oslo"));
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yy H:mm");
			return zonedDateTime.format(formatter);
		}

		public Resource getStatus() {
			return status;
		}

		public String getCreatedDate() {
			return createdDate;
		}

		public String getMessage() {
			return message;
		}

		public String getMessageOrEmpty() {
			if(message == null) return "";
			return message;
		}


		@Override
		public int compareTo(Harvest o) {

			return o.createdDate.compareTo(createdDate);
		}
	}
}
