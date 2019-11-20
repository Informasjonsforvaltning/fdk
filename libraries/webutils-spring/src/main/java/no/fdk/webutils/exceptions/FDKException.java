package no.fdk.webutils.exceptions;

public abstract class FDKException extends Exception {
    FDKException() {
        super();
    }

    FDKException(String message) {
        super(message);
    }

    FDKException(String message, Throwable cause) {
        super(message, cause);
    }

    FDKException(Throwable cause) {
        super(cause);
    }
}
