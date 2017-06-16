package no.dcat.authorization;

import org.springframework.http.HttpStatus;

/**
 * Created by dask on 16.06.2017.
 */
public class AuthorizationServiceUnavailable extends Exception {

    public AuthorizationServiceUnavailable(HttpStatus status) {
        super("Unable to access authorization service, service call returned status code " + status.toString());
    }

}
