package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Map;

/**
 * Created by dsk on 03.10.2017.
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QualityAnnotation {
    private String inDimension;
    private String motivatedBy;
    private Map<String, String> hasBody;
}
