package no.dcat.shared;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by extkkj on 10.10.2017.
 */
public class HelpText {

    public HelpText(String id, String title, String description) {
        this.title = title;
        this.description = description;
    }

    private String id;

    public URI getURI() throws URISyntaxException {
      return new URI("http://brreg.no/fdk/fields#" + id);
    }

    public String getAbstract() {
        return title;
    }

    public void setAbstract(String title) {
        this.title = title;
    }

    private String title;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    private String description;



}
