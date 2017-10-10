package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

/**
 * Created by extkkj on 10.10.2017.
 */

public class HelpText {

    private String id;


    private Map<String,String> title;
    private Map<String,String> description;

    @JsonCreator
    public HelpText(@JsonProperty("id") String id,
                    @JsonProperty("abstract") Map<String, String> title,
                    @JsonProperty("description") Map<String, String> description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    @JsonProperty("id")
    public String getId() {
        return id;
    }
    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty("abstract")
    public Map<String, String> getAbstract() {
        return title;
    }

    @JsonProperty("abstract")
    public Map<String, String> getTitle() {
        return title;
    }

    public void setAbstract(Map<String, String> title) {
        this.title = title;
    }
    @JsonProperty("description")
    public Map<String, String> getDescription() {
        return description;
    }
    @JsonProperty("description")
    public void setDescription(Map<String, String> description) {
        this.description = description;
    }




    public URI getURI() throws URISyntaxException {
      return new URI("http://brreg.no/fdk/fields#" + id);
    }

}
