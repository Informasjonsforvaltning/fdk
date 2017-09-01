package no.dcat.validation.model;

import lombok.Data;

import java.util.List;

/**
 * Created by dask on 25.04.2017.
 */
@Data
public class Condition {
    String property;
    List<String> values;
}
