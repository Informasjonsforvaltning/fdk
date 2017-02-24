package no.dcat.model;

import lombok.Data;
import lombok.ToString;

import java.util.Map;

/**
 * Created by bjg on 24.02.2017.
 * Model class to represent code  values
 */
@Data
@ToString(includeFieldNames = false)
public class SkosCode {
    private String code;
    private Map<String, String> title;
}
