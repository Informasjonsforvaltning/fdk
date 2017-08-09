package no.dcat.authorization;

import org.springframework.http.HttpStatus;

/**
 * Created by dask on 16.06.2017.
 */
public class AuthorizationServiceException extends Exception {

    public AuthorizationServiceException(HttpStatus status) {
        super("Unable to access authorization service, service call returned status code " + status.toString());
    }

    public AuthorizationServiceException(String status) {
        super(status);
    }

}
