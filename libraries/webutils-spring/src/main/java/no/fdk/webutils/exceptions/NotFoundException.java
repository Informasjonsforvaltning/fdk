package no.fdk.webutils.exceptions;

public class NotFoundException extends FDKException {

    public NotFoundException() {
        super();
    }

    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public NotFoundException(Throwable cause) {
        super(cause);
    }

    public NotFoundException(String message) {
        super(message);
    }
}

