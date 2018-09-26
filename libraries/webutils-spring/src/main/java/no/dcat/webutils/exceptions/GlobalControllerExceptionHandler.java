package no.dcat.webutils.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import org.springframework.security.access.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

public class GlobalControllerExceptionHandler {
    private static Logger logger = LoggerFactory.getLogger(GlobalControllerExceptionHandler.class);

    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    protected Object handleException(Exception ex) {
        logger.error("Server error: ",ex.getMessage(),ex);
        Map<String,String> result = new HashMap<>();
        result.put("error", "server_error");
        return result;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler({NotFoundException.class})
    @ResponseBody
    public Object handleNotFoundException(Exception ex) {
        logger.info("NotFound error:",ex.getMessage());
        Map<String,String> result = new HashMap<>();
        result.put("error", "not_found");
        return result;
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler({AccessDeniedException.class})
    @ResponseBody
    public Object handleAccessDeniedException(Exception ex) {
        logger.info("AccessDenied error:",ex.getMessage());
        Map<String,String> result = new HashMap<>();
        result.put("error", "access_denied");
        return result;
    }
}

