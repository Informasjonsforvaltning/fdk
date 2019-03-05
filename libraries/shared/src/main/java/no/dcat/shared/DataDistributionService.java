package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.List;
import java.util.Map;

/**
 * Created by bjg on 05.03.2019.
 * dcatapi:DataDistributionService
 * Subset of model of DataDistibutionService from DCAT draft specification
 * https://w3c.github.io/dxwg/dcat/
 *
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataDistributionService {
    private String id;
    private String uri;

    //dct:title
    //Norwgian: Tittel
    private Map<String,String> title;

    //dct:publisher
    //Norwegian: Utgiver
    private Publisher publisher;

    //dct:description
    //Norwegian: Beskrivelse
    private Map<String,String> description;

    //dcatapi:endpointDescription
    private List<SkosConcept> endpointDescription;
}
