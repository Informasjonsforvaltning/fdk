package no.fdk.webutils.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import static java.util.Collections.singletonMap;

public class GlobalControllerExceptionHandler {
    private static Logger logger = LoggerFactory.getLogger(GlobalControllerExceptionHandler.class);

    @ExceptionHandler({BadRequestException.class})
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Object handleBadRequestException(Exception ex) {
        logger.error("BadRequest error: {}", ex.getMessage(), ex);
        return singletonMap("error", "bad_request");
    }

    @ExceptionHandler({NotFoundException.class})
    @ResponseBody
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Object handleNotFoundException(Exception ex) {
        logger.error("NotFound error: {}", ex.getMessage(), ex);
        return singletonMap("error", "not_found");
    }

    @ExceptionHandler({AccessDeniedException.class})
    @ResponseBody
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Object handleAccessDeniedException(Exception ex) {
        logger.error("AccessDenied error: {}", ex.getMessage(), ex);
        return singletonMap("error", "access_denied");
    }

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected Object handleException(Exception ex) {
        logger.error("Server error: {}", ex.getMessage(), ex);
        return singletonMap("error", "server_error");
    }
}

