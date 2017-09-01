package no.dcat.model.exceptions;

public class DatasetNotFoundException extends Exception {
    private static final long serialVersionUID = 1L;

    public DatasetNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
