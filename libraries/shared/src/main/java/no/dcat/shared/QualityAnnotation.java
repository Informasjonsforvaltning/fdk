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
    public static final String AccuracyDimension = "Accuracy";
    public static final String AvailabilityDimension = "Availability";
    public static final String CompletenessDimension = "Completeness";
    public static final String CurrentnessDimension = "Currentness";
    public static final String RelevanceDimension = "Relevance";

    private String inDimension;
    private String motivatedBy;
    private Map<String,String> hasBody;
}
