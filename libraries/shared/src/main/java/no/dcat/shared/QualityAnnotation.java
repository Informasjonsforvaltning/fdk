package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Date;
import java.util.Map;

/**
 * Created by dsk on 03.10.2017.
 *
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QualityAnnotation {
    public static final String isoNS = "http://iso.org/25012/2008/dataquality/";
    public static final String Accuracy = isoNS + "Accuracy";
    public static final String Availability = isoNS + "Availability";
    public static final String Completeness = isoNS + "Completeness";
    public static final String Currentness = isoNS + "Currentness";
    public static final String Relevance = isoNS + "Relevance";

    private String inDimension;
    private String motivatedBy;
    private Map<String,String> hasBody;
}
