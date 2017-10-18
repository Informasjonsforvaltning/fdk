package no.dcat.shared;

import java.net.URI;
import java.util.Map;

/**
 * Created by extkkj on 10.10.2017.
 */

public class HelpText {

    private String id;
    private Map<String,String> shortdesc;
    private Map<String,String> description;

    public HelpText(String id,
                    Map<String, String> shortdesc,
                    Map<String, String> description) {
        this.id = id; // Internally, the id is actually a URI, but that's hard to modify
        this.shortdesc = shortdesc;
        this.description = description;
    }

    public String getId() {
        String parts[] = id.split("#");
        return parts[1];
    }

    public URI getURI() {
        return URI.create(id);
    }

    public Map<String, String> getShortdesc() {
        return shortdesc;
    }

    public Map<String, String> getDescription() {
        return description;
    }

}
