package no.dcat.shared;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

/**
 * Created by extkkj on 10.10.2017.
 */
public class HelpText {

    public HelpText(String id, Map<String, String> title, Map<String, String> description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    private String id;
    private Map<String,String> title;
    private Map<String,String> description;



    public URI getURI() throws URISyntaxException {
      return new URI("http://brreg.no/fdk/fields#" + id);
    }

}
