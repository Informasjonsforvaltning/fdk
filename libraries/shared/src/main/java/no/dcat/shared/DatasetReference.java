package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Map;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DatasetReference {

    private String id;

    private String uri;
    // dct:title
    // Norwegian: Tittel
    private Map<String,String> title;
}
