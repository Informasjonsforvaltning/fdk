package no.dcat.validation.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * Created by dask on 24.04.2017.
 */
@Data
@SuppressWarnings({"jacoco.complexity","jacoco.method","jacoco.branch"})
public class PropertyRule {
    String path;
    Integer minCount;
    Integer maxCount;
    String nodeKind;
    String severity;
    String clazz;
    Condition conditional;
    List<Map<String,String>> or;
}
