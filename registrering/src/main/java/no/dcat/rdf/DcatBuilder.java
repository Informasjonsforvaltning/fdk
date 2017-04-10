package no.dcat.rdf;

import no.dcat.model.Catalog;
import no.dcat.model.Contact;
import no.dcat.model.Dataset;
import no.dcat.model.Distribution;
import no.dcat.model.Publisher;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.Map;

/**
 * Created by dask on 10.04.2017.
 */
public class DcatBuilder {
    private final static Logger logger = LoggerFactory.getLogger(DcatBuilder.class);

    public final static Model mod = ModelFactory.createDefaultModel();
    public final static String DCAT = "http://www.w3.org/ns/dcat#";
    public final static String DCT  = "http://purl.org/dc/terms/";
    public final static String FOAF = "http://xmlns.com/foaf/0.1/";
    public final static String VCARD = "http://www.w3.org/2006/vcard/ns#";
    public final static String DCATNO = "http://difi.no/dcatno#";

    public final static Property dct_identifier = mod.createProperty(DCT,"identifier");
    public final static Property dct_publisher = mod.createProperty(DCT,"publisher");

    public final static Resource DCAT_CATALOG = mod.createResource(DCAT+"Catalog");
    public final static Property dcat_title = mod.createProperty(DCT, "title");
    public final static Property dcat_description = mod.createProperty(DCT, "description");
    public final static Property dcat_dataset = mod.createProperty(DCAT,"dataset");

    public final static Resource DCAT_DATASET = mod.createResource(DCAT+"Dataset");
    public final static Property dcat_contactPoint = mod.createProperty(DCAT, "contactPoint");
    public final static Property dcat_distribution = mod.createProperty(DCAT, "distribution");
    public final static Property dcat_keyword = mod.createProperty(DCAT,"keyword");

    public final static Resource DCAT_DISTRIBUTION = mod.createResource(DCAT+"Distribution");
    public final static Property dcat_accessUrl = mod.createProperty(DCAT, "accessUrl");
    public final static Property dcat_format = mod.createProperty(DCAT, "format");
    public final static Property dct_license = mod.createProperty(DCT,"license");

    public final static Resource FOAF_AGENT = mod.createResource(FOAF+"Agent");
    public final static Property foaf_name = mod.createProperty(FOAF,"name");

    public final static Resource VCARD_ORG = mod.createResource(VCARD+"Organization");
    public final static Property vcard_hasEmail = mod.createProperty(VCARD, "hasEmail");
    public final static Property vcard_fullName = mod.createProperty(VCARD, "fn");
    public final static Property vcard_OrganizationName = mod.createProperty(VCARD, "organization-name");
    public final static Property vcard_organizationUnit = mod.createProperty(VCARD, "organization-unit");
    public final static Property vcard_hasUrl = mod.createProperty(VCARD, "hasUrl");
    public final static Property vcard_hasTelephone = mod.createProperty(VCARD, "hasTelephone");

    public static String catPrefix = "http://reg.brreg.no/catalogs/";

    public static String transform(Catalog catalog, String outputFormat) {

        StringBuilder b = new StringBuilder();
        Model model = ModelFactory.createDefaultModel();
        model.setNsPrefix("dct", DCT);
        model.setNsPrefix("dcat", DCAT);
        model.setNsPrefix("foaf", FOAF);
        model.setNsPrefix("vcard", VCARD);

        Resource cat = model.createResource(catPrefix + catalog.getId());
        model.add(cat, RDF.type, DCAT_CATALOG);

        addLiteral(dcat_title, catalog.getTitle(), model, cat);
        addLiteral(dcat_description, catalog.getDescription(), model, cat);

        if (catalog.getPublisher() != null) {
            String pubUri = transform(catalog.getPublisher(), model);
            cat.addProperty(dct_publisher, pubUri);
        }

        if (catalog.getDataset() != null) {
            for (Dataset d : catalog.getDataset()) {
                String datasetUri = transform(d, model);
                cat.addProperty(dcat_dataset, datasetUri);
            }
        }

        OutputStream out = new ByteArrayOutputStream();
        model.write(out, outputFormat);
        return out.toString();
    }

    private static String transform(Publisher publisher, Model m) {
        Resource pub = m.createResource(publisher.getUri());
        m.add(pub, RDF.type, FOAF_AGENT);

        if (publisher.getName() != null) {
            pub.addProperty(foaf_name, publisher.getName());
        }

        if (publisher.getId() != null) {
            pub.addProperty(dct_identifier, publisher.getId());
        }

        return publisher.getUri();
    }

    private static String transform (Contact contact, Model m) {
        String uri = contact.getId();
        Resource con = m.createResource(uri);
        m.add(con, RDF.type, VCARD_ORG);

        if (contact.getEmail() != null) {
            if (!contact.getEmail().startsWith("mailto:")) {
                con.addProperty(vcard_hasEmail, "mailto:" + contact.getEmail());
            } else {
                con.addProperty(vcard_hasEmail, contact.getEmail());
            }
        }

        if (contact.getFullname() != null) {
            con.addProperty(vcard_fullName, contact.getFullname());
        }

        if (contact.getHasURL() != null) {
            con.addProperty(vcard_hasUrl, contact.getHasURL());
        }

        if (contact.getOrganizationName() != null) {
            con.addProperty(vcard_OrganizationName, contact.getOrganizationName());
        }

        if (contact.getOrganizationUnit() != null) {
            con.addProperty(vcard_organizationUnit, contact.getOrganizationUnit());
        }

        if (contact.getHasTelephone() != null) {
            if (!contact.getHasTelephone().startsWith("tel:")) {
                con.addProperty(vcard_hasTelephone, "tel:" + contact.getHasTelephone());
            } else {
                con.addProperty(vcard_hasTelephone, contact.getHasTelephone());
            }
        }

        return uri;
    }

    /**
     * Transform Dataset to RDF Model
     *
     * @param dataset the dataset to transform
     * @param m the model
     * @return the uri of the created dataset
     */
    private static String transform (Dataset dataset, Model m) {
        String uri = catPrefix + dataset.getId();
        Resource dat = m.createResource(uri);
        m.add(dat, RDF.type, DCAT_DATASET);

        addLiteral(dcat_title, dataset.getTitle(), m, dat);
        addLiteral(dcat_description, dataset.getDescription(), m, dat);

        if (dataset.getPublisher() != null) {
            dat.addProperty(dct_publisher, dataset.getPublisher().getUri());
        }

        if (dataset.getContactPoint().size() > 0) {
            for (Contact c : dataset.getContactPoint()) {
                String cpUri = transform(c, m);

                dat.addProperty(dcat_contactPoint, cpUri);
            }
        }

        if (dataset.getKeyword() != null && dataset.getKeyword().size() > 0) {
            for (Map<String, String> keyword : dataset.getKeyword()) {
                addLiteral(dcat_keyword, keyword, m, dat);
            }
        }

        if (dataset.getDistribution() != null && dataset.getDistribution().size() > 0) {
            for (Distribution dist : dataset.getDistribution()) {
                String distUri = transform(dist, uri, m);
                dat.addProperty(dcat_distribution, distUri);
            }
        }

        return uri;
    }

    private static String transform (Distribution distribution, String datasetUriPrefix, Model m) {
        String uri = datasetUriPrefix + "/" + distribution.getId();
        Resource dist = m.createResource(uri);
        m.add(dist, RDF.type, DCAT_DISTRIBUTION);

        addLiteral(dcat_title, distribution.getTitle(), m, dist);
        addLiteral(dcat_description, distribution.getDescription(), m, dist);

        if (distribution.getAccessURL() != null && distribution.getAccessURL().size() > 0) {
            for (String accessUrl : distribution.getAccessURL()) {
                dist.addProperty(dcat_accessUrl, accessUrl);
            }
        }

        if (distribution.getFormat() != null && distribution.getFormat().size() > 0) {
            for (String format : distribution.getFormat()) {
                dist.addProperty(dcat_format, format);
            }
        }

        if (distribution.getLicense() != null ) {
            dist.addProperty(dct_license, distribution.getLicense());
        }

        return uri;
    }

    private static Resource addLiteral(Property property, Map<String,String> map, Model model, Resource resource) {
        for (String l : map.keySet()) {
            String v = map.get(l);
            Literal literal = model.createLiteral(v,l);
            resource.addProperty(property, literal);
        }

        return resource;
    }
}
