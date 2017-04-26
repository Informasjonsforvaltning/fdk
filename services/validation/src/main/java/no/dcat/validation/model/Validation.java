package no.dcat.validation.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by dask on 24.04.2017.
 */
@Data
public class Validation {

    long timeStamp;

    int warnings = 0;
    int errors = 0;
    int oks = 0;

    List<Property> propertyReport;

    public Validation() {
        timeStamp = new Date().getTime();
        propertyReport = new ArrayList<>();
    }


}
