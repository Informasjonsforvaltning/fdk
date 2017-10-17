package no.dcat.harvester.clean;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Whitelist;

public class HtmlCleaner {

    private HtmlCleaner() {
        // Hiude the implicit public constructor
    }


    /**
     * Remove all html elements from text. Replaces html line breaks with java java line breaks
     * @param textToClean text with possible html elements
     *
     * @return text without html elements
     */
    public static String clean(String textToClean) {
        if (textToClean == null) {
            return null;
        }
        Document document = Jsoup.parse(textToClean);
        document.outputSettings(new Document.OutputSettings().prettyPrint(false));
        document.select("br").append("\\n");
        document.select("p").prepend("\\n\\n");
        String tempString = document.html()
                .replaceAll("\\\\n", "\n")
                .replaceAll("&nbsp;", " ");
        String soupCleanedString = Jsoup.clean(tempString, "",  Whitelist.none(), new Document.OutputSettings().prettyPrint(false));

        return soupCleanedString.replaceAll(" {2,}", " ");
    }
}
