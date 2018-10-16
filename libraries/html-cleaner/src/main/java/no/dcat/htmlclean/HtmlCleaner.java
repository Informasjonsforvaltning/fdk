package no.dcat.htmlclean;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Whitelist;

public class HtmlCleaner {

    private HtmlCleaner() {
        // Hide the implicit public constructor
    }


    /**
     * Remove all unsafe html elements from text. Only keep basic elements from whitelist.
     *
     * @param textToClean text with possible html elements
     *
     * @return text without unsafe elements
     */
    public static String clean(String textToClean) {
        if (textToClean == null) {
            return null;
        }
        return cleanString(textToClean, Whitelist.basic());
    }


    public static String cleanAllHtmlTags(String textToClean) {
        if (textToClean == null) {
            return null;
        }

        return cleanString(textToClean, Whitelist.none());

    }

    private static String cleanString(String textToClean, Whitelist whitelist) {
        Document document = Jsoup.parse(textToClean);
        document.outputSettings(new Document.OutputSettings().prettyPrint(false));

        String preprosessedString = document.html()
                .replaceAll("\\\\n", "\n")
                .replaceAll("&nbsp;", " ");

        String soupCleanedString = Jsoup.clean(preprosessedString, "", whitelist, new Document.OutputSettings().prettyPrint(false));

        return soupCleanedString.replaceAll(" {2,}", " ");
    }
}
