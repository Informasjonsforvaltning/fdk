package no.dcat.model.exceptions;

/**
 * Created by dask on 18.04.2017.
 */
public class CatalogNotFoundException extends Exception {
    private static final long serialVersionUID = 1L;

    public CatalogNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
