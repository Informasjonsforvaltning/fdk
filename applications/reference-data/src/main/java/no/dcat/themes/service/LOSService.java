package no.dcat.themes.service;

import jdk.nashorn.api.scripting.URLReader;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;

@Service
public class LOSService {

    public static final String defaultLanguage = "nb";
    static private final Logger logger = LoggerFactory.getLogger(LOSService.class);
    private static List<LosNode> allLosNodes;

    public List<LosNode> search(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return allLosNodes;
        }
        List<LosNode> results = new ArrayList<>();

        for (LosNode node : allLosNodes) {
            if (searchHit(keyword, node)) {
                results.add(node);
            }
        }
        return results;
    }

    private static boolean searchHit(String keyword, LosNode node) {

        if (caseInsensitiveSearchInMapValues(keyword, node.getName().values())) {
            return true;
        }
        if (node.getSynonyms() != null && caseInsensitiveSearchInMapValues(keyword, node.getSynonyms())) {
            return true;
        }
        return false;
    }

    private static boolean caseInsensitiveSearchInMapValues(String keyword, Collection<String> c) {
        for (String val : c) {
            if (val.equalsIgnoreCase(keyword)) {
                return true;
            }
        }
        return false;
    }

    private static String getMostSaneName(LosNode node) {
        if (node.getName().containsKey("nb")) {
            return node.getName().get("nb");
        }
        if (node.getName().containsKey("nn")) {
            return node.getName().get("nn");
        }
        if (node.getName().containsKey("en")) {
            return node.getName().get("en");
        }
        return "";
    }

    private static String getKeywordFromURI(String uri) {
        return uri.substring(uri.lastIndexOf('/') + 1);
    }

    private static String getKeywordFromURI(URI uri) {
        String path = uri.getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

    private static LosNode extractLosItemFromModel(Resource losResource) {
        LosNode node = new LosNode();
        node.setName(extractLanguageLiteral(losResource, SKOS.prefLabel));
        node.setDefinition(extractLanguageLiteral(losResource, SKOS.definition));
        node.setSynonyms(extractLanguageLiteralsOnlyValues(losResource, SKOS.hiddenLabel));
        node.setRelatedTerms(extractLiterals(losResource, SKOS.related));
        node.setParents(extractLiterals(losResource, SKOS.broader));
        node.setChildren(extractLiterals(losResource, SKOS.narrower));
        node.setTema(extractLiteral(losResource, SKOS.inScheme).toString().equals(LosNode.NODE_IS_TEMA_OR_SUBTEMA));
        node.setUri(losResource.getURI());
        return node;
    }

    public static List<URI> extractLiterals(Resource resource, Property property) {
        List<URI> list = new ArrayList<>();
        Statement stmt = resource.getProperty(property);
        if (stmt == null) {
            return null;
        }
        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            if (statement.getResource() != null) {
                try {
                    list.add(new URI(statement.getResource().getURI()));
                } catch (URISyntaxException ue) {
                    logger.warn("Got Exception for URI " + statement.getResource().getURI());
                }
            }
        }
        return list;
    }

    public static URI extractLiteral(Resource resource, Property property) {

        Statement stmt = resource.getProperty(property);
        if (stmt == null) {
            return null;
        }
        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            if (statement.getResource() != null) {
                try {
                    return new URI(statement.getResource().getURI());
                } catch (URISyntaxException ue) {
                    logger.warn("Got Exception for URI " + statement.getResource().getURI());
                }
            }
        }
        return null;
    }

    public static List<String> extractLanguageLiteralsOnlyValues(Resource resource, Property property) {
        Map<String, String> map = new HashMap<>();

        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String language = statement.getLanguage();
            if (language == null || language.isEmpty()) {
                language = defaultLanguage;
            }
            if (statement.getString() != null && !statement.getString().isEmpty()) {
                map.put(statement.getString(), language);
            }
        }
        return new ArrayList<>(map.keySet());
    }

    public static Map<String, String> extractLanguageLiteral(Resource resource, Property property) {
        Map<String, String> map = new HashMap<>();

        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String language = statement.getLanguage();
            if (language == null || language.isEmpty()) {
                language = defaultLanguage;
            }
            if (statement.getString() != null && !statement.getString().isEmpty()) {
                map.put(language, statement.getString());
            }
        }

        if (map.keySet().size() > 0) {
            return map;
        }

        return null;
    }

    @PostConstruct
    public void harvestLosDefinitions() {
        fillDatastructure();//Move this into some db storage. We do NOT want to harvest the entire world on startup.
    }

    public void fillDatastructure() {

        final Model model = ModelFactory.createDefaultModel();


        try {
            URL losSourceURL = new URL("http://psi.norge.no/los/all.rdf");
            URLReader ur = new URLReader(losSourceURL);
            model.read(ur, losSourceURL.toString());
            List<LosNode> losNodes = new ArrayList<>();

            ResIterator losIterator = model.listResourcesWithProperty(RDF.type, SKOS.Concept);

            while (losIterator.hasNext()) {
                Resource conceptResource = losIterator.nextResource();
                losNodes.add(extractLosItemFromModel(conceptResource));
            }
            allLosNodes = losNodes;

            //Secound pass - generate the paths.
            for (LosNode node : allLosNodes) {
                node.setLosPaths(generateLosPath(node));
            }

            logger.debug("Got {} LOSes", losNodes.size());
        } catch (MalformedURLException mue) {
            logger.error("Error while harvesting LOS ");
        }
    }

    public List<String> generateLosPath(LosNode node) {
        List<String> generatedPaths = new ArrayList<>();

        if (node.getParents() == null || node.getParents().isEmpty()) {
            return new ArrayList<>();
        }

        //Hovedkategori - /<keyword>
        if (node.getParents() == null || node.getParents().isEmpty()) {
            generatedPaths.add("/" + getMostSaneName(node));
            return generatedPaths;
        }

        //Underkategori - /<hovedkategori>/<underkategori>
        if (node.getChildren() != null && !node.getChildren().isEmpty()) {

            LosNode currentNode = node;
            List<URI> hovedKategoriURIs = currentNode.getParents();
            List<String> hovedKategoriPaths = new ArrayList<>();

            for (URI u : hovedKategoriURIs) {
                String subCategory = getKeywordFromURI(currentNode.getUri());
                hovedKategoriPaths.add(getKeywordFromURI(u) + "/" + subCategory);
            }
            return hovedKategoriPaths;
        }

        //Emneord - /<hovedkategori>/<underkatagori>/<emneord>
        List<String> allPaths = new ArrayList<>();

        List<URI> subCategoryURIs = node.getParents();
        for (URI us : subCategoryURIs) {
            LosNode subCategoryLosnode = getByURI(us);
            List<URI> hovedCategories = subCategoryLosnode.getParents();
            for (URI uh : hovedCategories) {
                allPaths.add("/" + getKeywordFromURI(uh) + "/" + getKeywordFromURI(us) + "/" + getMostSaneName(node));
            }
        }
        return allPaths;
    }

    public LosNode getByURI(URI keyword) {
        String uriAsString = keyword.toString();
        for (LosNode node : allLosNodes) {
            if (node.getUri().equals(uriAsString)) {
                return node;
            }
        }
        return null;
    }

}
