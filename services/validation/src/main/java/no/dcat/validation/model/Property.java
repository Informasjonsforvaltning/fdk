package no.dcat.validation.model;

import lombok.Data;

/**
 * Created by dask on 24.04.2017.
 */
@Data
public class Property {
    String name;
    int severity;
    String message;

    public Property(String name) {
        this.name = name;
    }
}
