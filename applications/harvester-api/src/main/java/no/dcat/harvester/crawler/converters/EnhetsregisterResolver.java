package no.dcat.harvester.crawler.converters;

import no.dcat.datastore.domain.dcat.Publisher;
import no.dcat.datastore.domain.dcat.builders.PublisherBuilder;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.dcat.datastore.domain.dcat.vocabulary.EnhetsregisteretRDF;
import no.dcat.harvester.HarvesterApplication;
import no.dcat.harvester.crawler.entities.Enhet;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.util.ResourceUtils;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class EnhetsregisterResolver {
    private static final Logger logger = LoggerFactory.getLogger(EnhetsregisterResolver.class);

    static final String URI_FORMAT = "http://data.brreg.no/enhetsregisteret/enhet/%s";
    static final String ORGNR_MATCHER = "(\\d{9})";

    private HashMap<String, String> canonicalNames = new HashMap<>();
    private Set<String> resolvedOrganizations = new HashSet<>();

    public EnhetsregisterResolver() {
        initializeCanonicalNames();
    }

    private void initializeCanonicalNames() {
        org.springframework.core.io.Resource canonicalNamesFile = new ClassPathResource("kanoniske.csv");
        Iterable<CSVRecord> records;
        try (Reader input = new BufferedReader(new InputStreamReader(canonicalNamesFile.getInputStream()))) {
            records = CSVFormat.EXCEL.parse(input);

            for (CSVRecord line : records) {
                canonicalNames.put(line.get(0), line.get(1));
            }

            logger.debug("Read {} canonical names from file.", canonicalNames.size());
        } catch (IOException e) {
            logger.error("Could not read canonical names: {}", e.getMessage());
        }
    }

    public Model resolveModel(final Model model) {
        processAgents(model, DCTerms.publisher);
        processAgents(model, DCTerms.creator);

        postprocessAgentNames(model);
        processAgentHierarchy(model);

        return model;
    }

    private void processAgents(final Model model, final Property agentProperty) {
        NodeIterator orgIterator = model.listObjectsOfProperty(agentProperty);
        while (orgIterator.hasNext()) {
            RDFNode next = orgIterator.next();
            if (next.isURIResource()) {
                Resource orgResource = next.asResource();
                orgResource = fixResourceURI(model, orgResource);
                collectEnhetsregisterInfoFromResource(model, orgResource);
            } else {
                logger.warn("{} is not a resource. Probably really broken input!", next);
            }
        }
    }

    private Resource fixResourceURI(final Model model, final Resource orgResource) {
        String currentOrgResourceURI = orgResource.getURI();

        String orgNr = getOrgNrFromIdentifier(model, orgResource);
        String fixedOrgResourceURI = orgNr==null ? currentOrgResourceURI : String.format(URI_FORMAT, orgNr); //Generate new URI if we found orgNr

        return currentOrgResourceURI.equals(fixedOrgResourceURI) ? orgResource : ResourceUtils.renameResource(orgResource, fixedOrgResourceURI);
    }

    public void collectEnhetsregisterInfoFromResource(final Model model, final Resource orgResource) {
        //Find orgNr
        String orgNo;
        if (orgResource.getURI().contains("data.brreg.no")) {
            orgNo = getOrgNrFromResource(orgResource);
        } else {
            orgNo = getOrgNrFromIdentifier(model, orgResource);
        }

        if (orgNo != null) {
            resolveEnhetsregister(model, orgResource, orgNo);
        } else {
            logger.info("Failed to find orgNr for {}", orgResource.getURI());
            model.addLiteral(orgResource, DCTerms.valid, false);
        }
    }

    private void resolveEnhetsregister(Model model, Resource orgResource, String orgNo) {
        if (resolvedOrganizations.contains(orgNo)) {
            return; // publisher is already processed, no need to process once more
        }

        try {
            //Add identifier
            model.add(orgResource, DCTerms.identifier, orgNo);

            RestTemplate restTemplate = new RestTemplate();
            String url = HarvesterApplication.getEnhetsregisterJsonUrlForOrganization(orgNo);
            Enhet enhet;

            enhet = restTemplate.getForObject(url, Enhet.class);
            if (enhet == null) {
                throw new Exception("Enhetsregisteret svarer ikke eller fant ikke organisasjonsnummeret " + orgNo);
            }

            Resource resolvedOrgResource = enhet.createResource(model, null, orgResource);

            addPreferredOrganisationName(model, resolvedOrgResource, orgNo, getOrgName(resolvedOrgResource));

            model.addLiteral(orgResource, DCTerms.valid, true);

            //Mark as resolved
            resolvedOrganizations.add(orgNo);

            //Recursive fetch OverordnetEnhet
            if (enhet.getOverordnetEnhet() != null) {
                Resource overordnetEnhetResource = model.getResource(String.format(URI_FORMAT, enhet.getOverordnetEnhet()));
                resolveEnhetsregister(model, overordnetEnhetResource, enhet.getOverordnetEnhet());
            }
        } catch (Exception e) {
            model.addLiteral(orgResource, DCTerms.valid, false);
            if (e instanceof HttpClientErrorException && ((HttpClientErrorException)e).getStatusCode().is4xxClientError()) {
                int statusCode = ((HttpClientErrorException)e).getStatusCode().value();
                String statusText = ((HttpClientErrorException)e).getStatusText();
                logger.warn("Unable to lookup organization {} in master data service. Statuscode={} {}", orgNo, statusCode, statusText!=null?statusText:"");
            } else {
                logger.warn("Unable to lookup organization {} in master data service. Reason {}", orgNo, e.getMessage(), e);
            }
        }
    }

    public void addPreferredOrganisationName(final Model model, final Resource resolvedOrgResource, final String orgNo, final String originalOrganisationName) {
        String preferredName = originalOrganisationName;
        if (preferredName==null && canonicalNames.containsKey(orgNo)) {
            preferredName = canonicalNames.get(orgNo); // if no preferredName is given and we have a name in canonicalNames choose that name
        }
        if (preferredName != null) {
            model.add(resolvedOrgResource, SKOS.prefLabel, model.createLiteral(preferredName, "no")); // add preferred name to prefLabel
        }
    }

    /**
     * Run through all agents and make sure that FOAF.name is set. It should be equal to original name or official name.
     * Original name should be in SKOS.prefLabel.
     *
     * @param model the model to iterate over and update
     */
    private void postprocessAgentNames(final Model model) {
        ResIterator resourceIterator = model.listResourcesWithProperty(RDF.type, FOAF.Agent);
        while (resourceIterator.hasNext()) {
            Resource resource = resourceIterator.nextResource();

            Statement foafName = resource.getProperty(FOAF.name);
            Statement prefLabel = resource.getProperty(SKOS.prefLabel);
            if (foafName == null || prefLabel != null) {
                Statement officialName = resource.getProperty(EnhetsregisteretRDF.navn);
                if (officialName != null) {
                    String officialNameString = officialName.getObject().asLiteral().getString();
                    logger.debug("Official name: {} replaces FOAF.name", officialNameString);

                    if (foafName != null) {
                        resource.removeAll(FOAF.name);
                    }
                    resource.addProperty(FOAF.name, officialNameString);
                }
            }
        }
    }

    private void processAgentHierarchy(final Model model) {
        List<Publisher> publishers = new PublisherBuilder(model).build();

        final Map<String, Publisher> publisherMap = new HashMap<>();
        publishers.forEach(publisher -> {
            if (publisher.getId() == null || publisher.getId().isEmpty()) {
                publisher.setId(publisher.getName());
            } else {
                if (publisherMap.containsKey(publisher.getId())) {
                    logger.error("Publisher {} is already registered and will be overwritten(duplicates in data?)", publisher.getId());
                }
            }
            publisherMap.put(publisher.getId(), publisher);
        });

        publishers.forEach(publisher -> {
            String orgPath = extractOrganizationPath(publisher, publisherMap);
            if (orgPath != null) {
                publisher.setOrgPath(orgPath);
                Resource publisherResource = model.getResource(publisher.getUri());
                if (publisherResource != null) {
                    publisherResource.addProperty(DCATNO.organizationPath, orgPath);
                }
            }
        });
    }

    private String extractOrganizationPath(final Publisher publisher, final Map<String, Publisher> publisherMap) {
        if (publisher == null) {
            return null;
        }

        String prefix;
        if (!(publisher.getOverordnetEnhet()==null ||
              publisher.getOverordnetEnhet().isEmpty() ||
              "/".equals(publisher.getOverordnetEnhet())
           )) {
            Publisher overordnetEnhet = publisherMap.get(publisher.getOverordnetEnhet());
            prefix = extractOrganizationPath(overordnetEnhet, publisherMap);
        } else {
            prefix = "/ANNET";
            if (publisher.isValid() && publisher.getOrganisasjonsform()!=null) {
                String orgForm = publisher.getOrganisasjonsform();

                if ("STAT".equals(orgForm) || "SF".equals(orgForm)) {
                    prefix = "/STAT";
                } else if ("FYLK".equals(orgForm)) {
                    prefix = "/FYLKE";
                } else if ("KOMM".equals(orgForm)) {
                    prefix = "/KOMMUNE";
                } else if ("IKS".equals(orgForm)) {
                    prefix = "/ANNET";
                } else {
                    prefix = "/PRIVAT";
                }
            }
        }
        String path = publisher.getId();
        String name = publisher.getName();
        if (path!=null && path.startsWith("http") && name!=null) {
            path = name;
        }
        return (prefix==null || path==null) ? null : (prefix + "/" + path);
    }

    private String getOrgNrFromIdentifier(final Model model, final Resource orgResource) {
        NodeIterator identIterator = model.listObjectsOfProperty(orgResource, DCTerms.identifier);
        // TODO: deal with the possibility of multiple dct:identifiers?
        if (identIterator.hasNext()) {
            String orgNr = identIterator.next().asLiteral().getValue().toString();
            return orgNr.replaceAll("\\s", "");
        } else {
            return getOrgNrFromResource(orgResource);
        }
    }

    private String getOrgNrFromResource(final Resource orgResource) {
        return getOrgNrFromUri(orgResource.getURI());
    }

    public static String getOrgNrFromUri(String uri) {
        if (uri == null) {
            return null;
        }

        Pattern p = Pattern.compile(ORGNR_MATCHER);
        Matcher m = p.matcher(uri);
        return m.find() ? m.group(1) : null;
    }

    private String getOrgName(Resource resource) {
        Statement nameStatement = resource.getProperty(FOAF.name);
        return nameStatement == null ? null : nameStatement.getObject().asLiteral().getString();
    }

}
