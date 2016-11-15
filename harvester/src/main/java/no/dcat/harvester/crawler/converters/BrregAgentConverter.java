package no.dcat.harvester.crawler.converters;

import com.google.common.cache.LoadingCache;

import no.acando.xmltordf.PostProcessingJena;
import no.acando.xmltordf.XmlToRdfAdvancedJena;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import no.acando.xmltordf.Builder;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.net.URL;

public class BrregAgentConverter {

	private  XmlToRdfAdvancedJena xmlToRdfObject;
	private LoadingCache<URL, String> brregCache;
	
	private static Logger logger = LoggerFactory.getLogger(BrregAgentConverter.class);

	public BrregAgentConverter(LoadingCache<URL, String> brregCache) {
		this.brregCache = brregCache;
		logger.debug("start BrregAgentConverter xmlToRdfObject");
		xmlToRdfObject = Builder.getAdvancedBuilderJena()
				.setBaseNamespace("http://data.brreg.no/meta/", Builder.AppliesTo.bothElementsAndAttributes)
				.convertComplexElementsWithOnlyAttributesAndSimpleTypeChildrenToPredicate(true)
				.convertComplexElementsWithOnlyAttributesToPredicate(true)
				.renameElement("http://data.brreg.no/meta/navn", FOAF.name.getURI())
				.renameElement("http://data.brreg.no/meta/enhet", FOAF.Agent.getURI()).build();
		logger.debug("end ");
	}

	private Model convert(InputStream inputStream) {
		try {
			PostProcessingJena postProcessingJena = xmlToRdfObject.convertForPostProcessing(inputStream);
			return convert(postProcessingJena);
		} catch (Exception e) {
			logger.error("Error converting InputStream", e);
			return ModelFactory.createDefaultModel();
		}
	}

	private Model convert(PostProcessingJena postProcessing) {
		Model extractedModel = ModelFactory.createDefaultModel();
		try {
			File intermediary = new File("/tmp/brreg");
			intermediary.mkdirs();
			
			ClassLoader classLoader = BrregAgentConverter.class.getClassLoader();
			File transforms = new File(classLoader.getResource("brreg/transforms").getFile());
			File constructs = new File(classLoader.getResource("brreg/constructs").getFile());
			
			extractedModel = postProcessing
					.mustacheTransform(classLoader.getResourceAsStream("brreg/transforms/00001.qr"), new Object())
					.mustacheTransform(classLoader.getResourceAsStream("brreg/transforms/00010.qr"), new Object())
				//	.mustacheExtract(classLoader.getResourceAsStream("brreg/constructs/00001.qr"), new Object())
					.getModel();

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
			if (brregCache != null) {

				String content = brregCache.get(url);
				logger.debug(content);
				InputStream inputStream = new ByteArrayInputStream(content.getBytes());
				Model incomingModel = convert(inputStream);

				logger.debug(incomingModel.toString());
				removeDuplicateProperties(model, incomingModel, FOAF.name); //TODO: remove all duplicate properties?

				model.add(incomingModel);
			} else {
				logger.warn("Unable to look up publisher {} - cache is not initiatilized.",uri);
			}


		} catch (Exception e) {
			logger.warn("Failed to look up publisher: {} reason {}", uri, e.getMessage());
		}	
	}

	private void removeDuplicateProperties(Model existingModel, Model incomingModel, Property property) {
		ResIterator incomingModelIterator = incomingModel.listResourcesWithProperty(property);

		final Property p = ResourceFactory.createProperty("http://www.w3.org/2005/Atom#href");

		//logger.debug(property.toString());
		while (incomingModelIterator.hasNext()) {
			Resource incomingResource =  incomingModelIterator.next();
			/* TODO - fix this mess. Nodes are not found in merged model!
			String uri = incomingResource.getProperty(p).getString();
			Resource existingResource = existingModel.getResource(uri);
			logger.debug("old:" +existingResource.getPropertyResourceValue(property)); //getProperty(property).getString());
			logger.debug("new:" +incomingModel.getResource(uri).getPropertyResourceValue(property)); //.getProperty(property).getString());
			existingResource.removeAll(property);
			*/
		}
	}

	private static void applyNamespaces(Model extractedModel) {
		extractedModel.setNsPrefix("foaf", FOAF.getURI());
	}
}
