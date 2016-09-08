package no.difi.dcat.harvester.crawler.converters;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.net.URL;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.cache.LoadingCache;

import no.acando.semtech.xmltordf.Builder;
import no.acando.semtech.xmltordf.PostProcessing;
import no.acando.semtech.xmltordf.XmlToRdfObject;

public class BrregAgentConverter {

	private XmlToRdfObject xmlToRdfObject;
	private LoadingCache<URL, String> brregCache;
	
	private static Logger logger = LoggerFactory.getLogger(BrregAgentConverter.class);

	public BrregAgentConverter(LoadingCache<URL, String> brregCache) {
		this.brregCache = brregCache;
		
		xmlToRdfObject = Builder.getObjectBasedBuilder()
				.setBaseNamespace("http://data.brreg.no/meta/", Builder.AppliesTo.bothElementsAndAttributes)
				.autoConvertShallowChildrenToProperties(true)
				.autoConvertShallowChildrenWithAutoDetectLiteralProperties(true)
				.addTransformForClass("http://data.brreg.no/meta/navn", FOAF.name.getURI())
				.addTransformForClass("http://data.brreg.no/meta/enhet", FOAF.Agent.getURI()).build();
	}

	private Model convert(InputStream inputStream) {
		try {
			return convert(xmlToRdfObject.convertForPostProcessing(inputStream));
		} catch (Exception e) {
			logger.error("Error converting InputStream", e);
			return ModelFactory.createDefaultModel();
		}
	}

	private Model convert(PostProcessing postProcessing) {
		Model extractedModel = ModelFactory.createDefaultModel();
		try {
			File intermediary = new File("/tmp/brreg");
			intermediary.mkdirs();
			
			ClassLoader classLoader = BrregAgentConverter.class.getClassLoader();
			File transforms = new File(classLoader.getResource("brreg/transforms").getFile());
			File constructs = new File(classLoader.getResource("brreg/constructs").getFile());
			
			extractedModel = postProcessing.outputIntermediaryModels(intermediary)
					.sparqlTransform(transforms)
					.extractConstruct(constructs).getExtractedModel();

			applyNamespaces(extractedModel);
			
			return extractedModel;
		} catch (Exception e) {
			logger.error("Error converting PostProcessing", e);
		}

		return extractedModel;
	}
	
	public void collectFromModel(Model model) {
		NodeIterator iterator = model.listObjectsOfProperty(DCTerms.publisher);
		
		while (iterator.hasNext()) {
			RDFNode next = iterator.next();
			if (next.isURIResource() && next.asResource().getURI().contains("data.brreg.no")) {
				String uri = next.asResource().getURI();
				collectFromUri(uri, model);
			} else {
				logger.trace("{} either is not a resource or does not contain \"data.brreg.no\"", next);
			}
		}
		
		
	}
	
	protected void collectFromUri(String uri, Model model) {
		if (!uri.endsWith(".xml")) {
			uri = uri + ".xml";
		}
			
		try {
			URL url = new URL(uri);
			String content = brregCache.get(url);
			InputStream inputStream = new ByteArrayInputStream(content.getBytes());
			Model incomingModel = convert(inputStream);
			
			removeDuplicateProperties(model, incomingModel, FOAF.name); //TODO: remove all duplicate properties?
			
			model.add(incomingModel);
			
		} catch (Exception e) {
			logger.warn("Failed to look up publisher: {}", uri, e);
		}	
	}

	private void removeDuplicateProperties(Model existingModel, Model incomingModel, Property property) {
		ResIterator incomingModelIterator = incomingModel.listResourcesWithProperty(property);
		
		while (incomingModelIterator.hasNext()) {
			Resource existingResource = existingModel.getResource(incomingModelIterator.next().getURI());
			existingResource.removeAll(property);
		}
	}

	private static void applyNamespaces(Model extractedModel) {
		extractedModel.setNsPrefix("foaf", FOAF.getURI());
	}
}
