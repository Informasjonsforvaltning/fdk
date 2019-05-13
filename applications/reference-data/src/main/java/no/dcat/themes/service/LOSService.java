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
import java.util.stream.Collectors;

@Service
public class LOSService {

    public static final String defaultLanguage = "nb";
    static private final Logger logger = LoggerFactory.getLogger(LOSService.class);
    private static List<LosNode> allLosNodes;

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

    public List<LosNode> getAll() {
        return allLosNodes;
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

        //Hovedkategori - /<keyword>
        if (node.getParents() == null || node.getParents().isEmpty()) {
            generatedPaths.add(getKeywordFromURI(node.getUri().toLowerCase()));
            return generatedPaths;
        }

        //Underkategori - /<hovedkategori>/<underkategori>
        if (node.getChildren() != null && !node.getChildren().isEmpty()) {

            LosNode currentNode = node;
            List<URI> hovedKategoriURIs = currentNode.getParents();
            List<String> hovedKategoriPaths = new ArrayList<>();

            for (URI u : hovedKategoriURIs) {
                String subCategory = getKeywordFromURI(currentNode.getUri());
                hovedKategoriPaths.add((getKeywordFromURI(u) + "/" + subCategory).toLowerCase());
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
                allPaths.add((getKeywordFromURI(uh) + "/" + getKeywordFromURI(us) + "/" + getMostSaneName(node)).toLowerCase());
            }
        }
        return allPaths;
    }
    public static LosNode getByURIString (String uri) throws URISyntaxException {
        URI actualURI = new URI(uri);
        return getByURI(actualURI);
    }

    public static LosNode getByURI(URI keyword) {
        String uriAsString = keyword.toString();
        for (LosNode node : allLosNodes) {
            if (node.getUri().equals(uriAsString)) {
                return node;
            }
        }
        return null;
    }

    public boolean hasLosThemes(List<String> themes) {
        if (themes == null || themes.isEmpty()) {
            return false;
        }
        for (String theme : themes) {
            if (isLosTheme(theme)) {
                return true;
            }
        }
        return false;
    }

    private static boolean isLosTheme(String theme) {
        try {
            if (getByURIString(theme) != null) {
                return true;
            }
        } catch (URISyntaxException use) {

        }
        return false;
    }

    private static boolean isLosPath(String path) {
        for (LosNode node : allLosNodes) {
            for (String nodePath : node.getLosPaths()) {
                if (nodePath.equalsIgnoreCase(path)) {
                    return true;
                }
            }
        }
        return false;
    }

    public List<String> expandLosThemes(List<String> themes) {
        List<String> keyWords = new ArrayList<>();
        for (String theme : themes) {
            if (isLosTheme(theme)) {
                keyWords.addAll(expandSingleTheme(theme));
            }
        }
        return keyWords;
    }

    public List<String> expandLosThemesByPaths(List<String> paths) {
        List<String> keyWords = new ArrayList<>();
        for (String path : paths) {
            if (isLosPath(path)) {
                keyWords.addAll(expandSinglePath(path));
            }
        }
        return keyWords;
    }

    private static List<String> expandSinglePath(String path) {
        List<String> expandedPaths = new ArrayList<>();
        for (LosNode node : allLosNodes) {
            if (hasLOSPathAsPathsegment(node.getLosPaths(), path)) {
                expandedPaths.addAll(node.getLosPaths());
            }
        }
        //Remove duplicates
        return expandedPaths.stream().distinct().collect(Collectors.toList());
    }

    private static boolean hasLOSPathAsPathsegment(List<String> losPaths, String losPathToFind) {
        if (losPaths == null || losPaths.size() == 0 || losPathToFind == null) {
            return false;
        }
        int slashCount = org.springframework.util.StringUtils.countOccurrencesOf(losPathToFind, "/");
        boolean isSubTheme = slashCount == 1;

        for (String singlePath : losPaths) {
            List<String> segments = Arrays.asList(singlePath.split("/"));
            for (String singleSegment : segments) {
                if (losPathToFind.equalsIgnoreCase(singleSegment)) {
                    return true;
                }
            }

            if (singlePath.equalsIgnoreCase(losPathToFind)) {
                return true;
            }
            if (isSubTheme) {
                //We are searching for a subtheme and the node we are comparing with is an Emne (arbeid/arbeidsliv/mobbing)
                if (org.springframework.util.StringUtils.countOccurrencesOf(singlePath, "/") == 2) {
                    int firstIndex = singlePath.indexOf("/");
                    int secoundIndex = singlePath.indexOf("/", firstIndex+1);
                    String choppedEmne = singlePath.substring(0, secoundIndex);
                    if (choppedEmne.equalsIgnoreCase(losPathToFind)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private static List<String> expandSingleTheme(String theme)  {
        List<String> keyWords = new ArrayList<>();

        try {
            LosNode node = getByURIString(theme);

            //add the names
            for (String langCode : node.getName().keySet()) {
                String nameInLanguage = node.getName().get(langCode);
                keyWords.add(nameInLanguage);
            }

            //if emneord : add the synonyms, else add children (and childrens children)
            if (!node.isTema) {
                keyWords.addAll(node.getSynonyms());

                //get the grandparents
                for (URI parentURI : node.getParents()) {
                    LosNode parentNode = getByURI(parentURI);
                    for (URI grandparentURI : parentNode.getParents()) {
                        LosNode grandParentNode = getByURI(grandparentURI);
                        for (String langCode : grandParentNode.getName().keySet()) {
                            keyWords.add(grandParentNode.getName().get(langCode));
                        }
                    }
                }

            } else {
                List<LosNode> children = new ArrayList<>();

                //Add the immediate parent(s)
                for (URI parentURI : node.getParents()) {
                    LosNode parentNode = getByURI(parentURI);
                    for (String langCode : parentNode.getName().keySet()) {
                        keyWords.add(parentNode.getName().get(langCode));
                    }
                }
                for (URI child : node.getChildren()) {
                    children.add(getByURI(child));
                }
                boolean hasGrandChildren = node.parents == null;//Only toplevel Tema has grandchildren
                if (hasGrandChildren) {
                    List<LosNode> childrensChildren = new ArrayList<>();
                    for (LosNode child : children) {
                        List<URI> grandChildren = child.getChildren();
                        for (URI grandChild : grandChildren) {
                            LosNode grandChildNode = getByURI(grandChild);
                            childrensChildren.add(grandChildNode);
                        }
                    }
                    children.addAll(childrensChildren);
                    for (LosNode child : childrensChildren) {
                        //Add all the names in all the languages
                        for (String langCode : child.getName().keySet()) {
                            keyWords.add(child.getName().get(langCode));
                        }
                    }
                }
            }
        } catch (Exception use) {
            logger.debug("While expanding LOS Theme, got exeption for theme " + theme, use);
        }

        return keyWords;
    }
}
