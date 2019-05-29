package no.dcat.themes.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LOSService {

    static private final Logger logger = LoggerFactory.getLogger(LOSService.class);
    private static List<LosNode> allLosNodes;
    private static HashMap<String, LosNode> allLosNodesByURI;
    @Autowired
    public LosRDFImporter losRDFImporter;

    private Boolean losTemaHasBeenHarvested = false;

    public static LosNode getByURI(URI keyword) {
        String uriAsString = keyword.toString();
        for (LosNode node : allLosNodes) {
            if (node.getUri().equals(uriAsString)) {
                return node;
            }
        }
        return null;
    }

    public static LosNode getByURIString(String uri) throws URISyntaxException {
        URI actualURI = new URI(uri);
        return getByURI(actualURI);
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
                    int secoundIndex = singlePath.indexOf("/", firstIndex + 1);
                    String choppedEmne = singlePath.substring(0, secoundIndex);
                    if (choppedEmne.equalsIgnoreCase(losPathToFind)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private static List<String> expandSingleTheme(String theme) {
        List<String> keyWords = new ArrayList<>();

        try {
            LosNode node = getByURIString(theme);

            //add the names
            for (String langCode : node.getName().keySet()) {
                String nameInLanguage = node.getName().get(langCode);
                keyWords.add(nameInLanguage);
            }

            if (!node.isTema) {
                //This is an Emneord
                keyWords.addAll(node.getSynonyms());
                //get the grandparents
                for (URI parentURI : node.getParents()) {
                    LosNode parentNode = getByURI(parentURI);
                    for (String langCode : parentNode.getName().keySet()) {
                        keyWords.add(parentNode.getName().get(langCode));//Add the parent
                    }
                    for (URI grandparentURI : parentNode.getParents()) {
                        LosNode grandParentNode = getByURI(grandparentURI);
                        for (String langCode : grandParentNode.getName().keySet()) {
                            keyWords.add(grandParentNode.getName().get(langCode)); //Add the parent's parent
                        }
                    }
                }
            } else {
                //This is either a toplevel Tema or a subTema
                List<LosNode> children = new ArrayList<>();
                //Add the immediate parent(s) - if any!
                if (node.getParents() != null && !node.getParents().isEmpty()) {
                    for (URI parentURI : node.getParents()) {
                        LosNode parentNode = getByURI(parentURI);
                        for (String langCode : parentNode.getName().keySet()) {
                            keyWords.add(parentNode.getName().get(langCode));
                        }
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
                }
                for (LosNode child : children) {
                    //Add all the names in all the languages
                    for (String langCode : child.getName().keySet()) {
                        keyWords.add(child.getName().get(langCode));
                    }
                }
            }
        } catch (Exception use) {
            logger.debug("While expanding LOS Theme, got exeption for theme " + theme, use);
        }

        return keyWords;
    }

    public List<LosNode> getAll() {
        return allLosNodes;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void loadLOSTemaAfterStartup() {

        List<LosNode> allLosNodesTMP = new ArrayList<>();
        HashMap<String, LosNode> allLosNodesByURITMP = new HashMap<>();

        if (!losTemaHasBeenHarvested) {
            losRDFImporter.importFromLosSource(allLosNodesTMP, allLosNodesByURITMP);
        }
        allLosNodes = allLosNodesTMP;
        allLosNodesByURI = allLosNodesByURITMP;
    }

    public void fillDatastructure() {
        List<LosNode> allLosNodesTMP = new ArrayList<>();
        HashMap<String, LosNode> allLosNodesByURITMP = new HashMap<>();

        losRDFImporter.importFromLosSource(allLosNodesTMP, allLosNodesByURITMP);
        allLosNodes = allLosNodesTMP;
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
}
